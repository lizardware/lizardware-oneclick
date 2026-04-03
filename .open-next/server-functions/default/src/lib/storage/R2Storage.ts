
import { getR2Bucket, getD1Database } from '@/lib/cloudflare';
import type { MediaStorage, MediaAsset, ListOptions } from './MediaStorage';

export class R2Storage implements MediaStorage {
    getName(): string {
        return 'r2';
    }

    private getKeyFromUrl(url: string): string {
        // format: /api/media/file/KEY
        const parts = url.split('/');
        return parts[parts.length - 1];
    }

    async getUsage(): Promise<{ used: number; limit?: number }> {
        const db = await getD1Database();
        if (!db) return { used: 0, limit: 0 };

        const result = await db.prepare("SELECT SUM(filesize) as total FROM media WHERE provider = 'r2'").first<{ total: number }>();
        const used = result?.total || 0;

        // Display Limit (R2 Free Tier is 10GB per account, we'll use it as a logical bucket limit)
        const limit = 10 * 1024 * 1024 * 1024;

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
            provider: row.provider || 'r2',
            altText: row.alt_text || undefined,
            dimensions: row.dimensions || undefined,
            size: row.filesize,
            tags,
            createdAt: row.created_at,
            updatedAt: row.updated_at
        };
    }

    async upload(file: File, metadata?: { altText?: string; caption?: string; tags?: string[] }): Promise<string> {
        const bucket = await getR2Bucket();
        const db = await getD1Database();

        if (!bucket || !db) {
            throw new Error('Storage unavailable. R2 requires production environment.');
        }

        const timestamp = Date.now();
        const uuid = crypto.randomUUID();
        const safeFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const key = `${timestamp}-${uuid}-${safeFilename}`;

        // Upload to R2
        const arrayBuffer = await file.arrayBuffer();
        await bucket.put(key, arrayBuffer, {
            httpMetadata: {
                contentType: file.type,
            },
            customMetadata: {
                originalName: file.name
            }
        });

        // Public URL (using API proxy strategy)
        const url = `/api/media/file/${key}`;

        // Insert into D1 with rollback on failure
        const id = uuid;

        try {
            await db.prepare(`
                INSERT INTO media (id, provider, url, alt_text, dimensions, filesize, tags, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, (strftime('%s', 'now')), (strftime('%s', 'now')))
            `).bind(
                id,
                'r2',
                url,
                metadata?.altText || null,
                null, // dimensions (could be extracted if image)
                file.size,
                JSON.stringify(metadata?.tags || [])
            ).run();
        } catch (dbError) {
            // CRITICAL: Rollback R2 upload to prevent orphaned files
            console.error('D1 insert failed, rolling back R2 upload:', dbError);
            try {
                await bucket.delete(key);
            } catch (rollbackError) {
                console.error('Rollback failed - orphaned file in R2:', key, rollbackError);
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

    async delete(url: string): Promise<void> {
        const bucket = await getR2Bucket();
        const db = await getD1Database();

        if (!bucket || !db) {
            throw new Error('R2 or D1 binding missing');
        }

        const key = this.getKeyFromUrl(url);
        if (!key) throw new Error('Invalid URL');

        // Delete from R2
        await bucket.delete(key);

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
