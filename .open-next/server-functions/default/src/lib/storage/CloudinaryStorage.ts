
import { getD1Database } from '@/lib/cloudflare';
import type { MediaStorage, MediaAsset, ListOptions } from './MediaStorage';

export interface CloudinaryConfig {
    cloudName: string;
    apiKey: string;
    apiSecret: string;
    uploadPreset?: string;
    folder?: string;
}

export class CloudinaryStorage implements MediaStorage {
    private config: CloudinaryConfig;

    constructor(config: CloudinaryConfig) {
        // Validate cloudName format to prevent SSRF
        if (!/^[a-z0-9-]+$/.test(config.cloudName)) {
            throw new Error('Invalid Cloudinary cloud name format. Must contain only lowercase letters, numbers, and hyphens.');
        }
        this.config = config;
    }

    getName(): string {
        return 'cloudinary';
    }

    private async sha1(message: string): Promise<string> {
        const encoder = new TextEncoder();
        const data = encoder.encode(message);
        const hash = await crypto.subtle.digest('SHA-1', data);
        return Array.from(new Uint8Array(hash))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }

    async getUsage(): Promise<{ used: number; limit?: number }> {
        const db = await getD1Database();
        if (!db) return { used: 0, limit: 0 };

        const result = await db.prepare("SELECT SUM(filesize) as total FROM media WHERE provider = 'cloudinary'").first<{ total: number }>();
        const used = result?.total || 0;

        // Display Limit (Cloudinary Free Tier typically has 25GB storage)
        const limit = 25 * 1024 * 1024 * 1024;

        return { used, limit };
    }

    private mapRowToAsset(row: any): MediaAsset {
        let tags: string[] = [];
        try {
            if (row.tags) tags = JSON.parse(row.tags);
        } catch (e) {
            // Fallback
        }

        return {
            id: row.id,
            filename: row.url.split('/').pop() || 'unknown',
            url: row.url,
            provider: row.provider || 'cloudinary',
            altText: row.alt_text || undefined,
            dimensions: row.dimensions || undefined,
            size: row.filesize,
            tags,
            createdAt: row.created_at,
            updatedAt: row.updated_at
        };
    }

    async upload(file: File, metadata?: { altText?: string; caption?: string; tags?: string[] }): Promise<string> {
        const db = await getD1Database();
        if (!db) {
            throw new Error('Database unavailable.');
        }

        const timestamp = Math.round(Date.now() / 1000).toString();
        const uuid = crypto.randomUUID();

        // For signed upload, we need to sign parameters
        // parameters should be sorted alphabetically
        // folder=<name>&timestamp=...<api_secret>
        const folder = this.config.folder || 'media';
        const signatureStr = `folder=${folder}&timestamp=${timestamp}${this.config.apiSecret}`;
        const signature = await this.sha1(signatureStr);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('api_key', this.config.apiKey);
        formData.append('timestamp', timestamp);
        formData.append('signature', signature);
        formData.append('folder', folder);

        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${this.config.cloudName}/image/upload`,
            {
                method: 'POST',
                body: formData,
                signal: AbortSignal.timeout(30000), // 30 second timeout
            }
        );

        if (!response.ok) {
            const errorData = await response.json() as any;
            throw new Error(`Cloudinary upload failed (HTTP ${response.status}): ${errorData.error?.message || response.statusText}`);
        }

        const data = await response.json() as any;
        const url = data.secure_url;
        const publicId = data.public_id;

        // Insert into D1
        const id = uuid;
        try {
            await db.prepare(`
                INSERT INTO media (id, provider, url, alt_text, dimensions, filesize, tags, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, (strftime('%s', 'now')), (strftime('%s', 'now')))
            `).bind(
                id,
                'cloudinary',
                url,
                metadata?.altText || null,
                `${data.width}x${data.height}`,
                data.bytes,
                JSON.stringify(metadata?.tags || [])
            ).run();
        } catch (dbError) {
            // Rollback Cloudinary upload
            console.error('D1 insert failed, rolling back Cloudinary upload:', dbError);
            try {
                await this.deleteFromCloudinary(publicId);
            } catch (rollbackError) {
                console.error('Rollback failed - orphaned file in Cloudinary:', publicId, rollbackError);
            }
            throw new Error('Failed to save media metadata');
        }

        return url;
    }

    async update(id: string, metadata: { altText?: string; caption?: string; tags?: string[] }): Promise<void> {
        const db = await getD1Database();
        if (!db) throw new Error('D1 database unavailable.');

        // Build dynamic query
        const updates: string[] = [];
        const values: any[] = [];

        if (metadata.altText !== undefined) {
            updates.push('alt_text = ?');
            values.push(metadata.altText);
        }
        if (metadata.tags !== undefined) {
            updates.push('tags = ?');
            values.push(JSON.stringify(metadata.tags));
        }

        updates.push("updated_at = (strftime('%s', 'now'))");
        values.push(id);

        if (updates.length > 1) {
            await db.prepare(`UPDATE media SET ${updates.join(', ')} WHERE id = ?`)
                .bind(...values)
                .run();
        }
    }

    private async deleteFromCloudinary(publicId: string): Promise<void> {
        const timestamp = Math.round(Date.now() / 1000).toString();
        const signatureStr = `public_id=${publicId}&timestamp=${timestamp}${this.config.apiSecret}`;
        const signature = await this.sha1(signatureStr);

        const formData = new FormData();
        formData.append('public_id', publicId);
        formData.append('api_key', this.config.apiKey);
        formData.append('timestamp', timestamp);
        formData.append('signature', signature);

        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${this.config.cloudName}/image/destroy`,
            {
                method: 'POST',
                body: formData,
                signal: AbortSignal.timeout(10000), // 10 second timeout for deletes
            }
        );

        if (!response.ok) {
            const errorData = await response.json() as any;
            throw new Error(`Cloudinary delete failed (HTTP ${response.status}): ${errorData.error?.message || response.statusText}`);
        }
    }

    async delete(url: string): Promise<void> {
        const db = await getD1Database();
        if (!db) {
            throw new Error('Database unavailable.');
        }

        // We need the public_id to delete from Cloudinary. 
        // We can parse it from the URL: https://res.cloudinary.com/.../upload/v12345/folder/public_id.jpg
        const urlParts = url.split('/');
        const lastPart = urlParts[urlParts.length - 1];
        const publicIdWithExt = lastPart.split('.')[0];

        // If there's a version/upload part, we need to be careful.
        // Usually the public_id is everything after the version stamp.
        const uploadIndex = urlParts.indexOf('upload');
        let publicId = '';
        if (uploadIndex !== -1) {
            // Skip 'upload' and the 'v12345' version stamp
            publicId = urlParts.slice(uploadIndex + 2).join('/').split('.')[0];
        } else {
            publicId = publicIdWithExt;
        }

        // Delete from Cloudinary
        await this.deleteFromCloudinary(publicId);

        // Delete from D1
        await db.prepare('DELETE FROM media WHERE url = ?').bind(url).run();
    }

    async list(options?: ListOptions): Promise<MediaAsset[]> {
        const db = await getD1Database();
        if (!db) return [];

        const { results } = await db.prepare('SELECT * FROM media ORDER BY created_at DESC').all();

        return results.map(row => this.mapRowToAsset(row));
    }

    async get(id: string): Promise<MediaAsset | null> {
        const db = await getD1Database();
        if (!db) return null;

        const row = await db.prepare('SELECT * FROM media WHERE id = ?').bind(id).first();
        if (!row) return null;

        return this.mapRowToAsset(row);
    }
}
