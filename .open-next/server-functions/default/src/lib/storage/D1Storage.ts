
import { getD1Database } from '@/lib/cloudflare';
import type { MediaStorage, MediaAsset } from './MediaStorage';

export class D1Storage implements MediaStorage {
    getName(): string {
        return 'd1';
    }

    private mapRowToAsset(row: any): MediaAsset {
        let tags: string[] = [];
        try {
            if (row.tags) tags = JSON.parse(row.tags);
        } catch (e) {
            // Fallback for corrupt data
        }

        return {
            id: row.id,
            filename: row.url.split('/').pop() || 'unknown',
            url: row.url,
            provider: row.provider || 'd1',
            altText: row.alt_text || undefined,
            dimensions: row.dimensions || undefined,
            size: row.filesize,
            tags,
            createdAt: row.created_at,
            updatedAt: row.updated_at
        };
    }

    async getUsage(): Promise<{ used: number; limit?: number }> {
        const db = await getD1Database();
        if (!db) return { used: 0, limit: 0 };

        // Calculate total size of blobs
        // Note: 'length(data)' on BLOB returns bytes in SQLite
        const result = await db.prepare('SELECT SUM(filesize) as total FROM media WHERE provider = \'d1\'').first<{ total: number }>();
        const used = result?.total || 0;

        // Limit (Publicly Displayed as 100MB)
        // We use 100MB as the 'denominator' for UI calculations.
        const limit = 100 * 1024 * 1024;

        return { used, limit };
    }

    private async checkQuota(fileSize: number): Promise<void> {
        const { used, limit } = await this.getUsage();

        // Soft Limit: 90MB (Warning only - handled by UI)
        // Display Limit: 100MB (UI uses this as 100%)
        // Hard Limit: 125MB (Absolute rejection)
        const HARD_LIMIT = 125 * 1024 * 1024;

        if ((used + fileSize) > HARD_LIMIT) {
            throw new Error(`Storage Limit Exceeded (CRITICAL). Usage: ${((used + fileSize) / 1024 / 1024).toFixed(2)}MB. Hard limit is 125MB. Please delete files or upgrade storage.`);
        }
    }

    async upload(file: File, metadata?: { altText?: string; caption?: string; tags?: string[] }): Promise<string> {
        const db = await getD1Database();

        if (!db) {
            throw new Error('D1 database unavailable.');
        }

        // 1. Validation: Check file size (limit to 5MB for D1 health)
        const MAX_SIZE = 5 * 1024 * 1024; // 5MB
        if (file.size > MAX_SIZE) {
            throw new Error(`File too large for D1 storage. Maximum size is 5MB. Use R2/Cloudinary for larger files.`);
        }

        // 2. Check Global Quota
        await this.checkQuota(file.size);

        const id = crypto.randomUUID();
        const timestamp = Date.now();
        const safeFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const filename = `${timestamp}-${safeFilename}`; // We store this as "filename" key just like R2

        // URL points to blob serving endpoint
        const url = `/api/media/blob/${id}`;

        const arrayBuffer = await file.arrayBuffer();

        // 3. Transactional Insert (if possible, otherwise sequential)
        // We'll try to insert blob first, then metadata.

        try {
            // Insert Blob
            await db.prepare('INSERT INTO media_blobs (id, data) VALUES (?, ?)')
                .bind(id, arrayBuffer)
                .run();

            // Insert Metadata
            await db.prepare(`
                INSERT INTO media (id, provider, url, alt_text, dimensions, filesize, tags, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, (strftime('%s', 'now')), (strftime('%s', 'now')))
            `).bind(
                id,
                'd1',
                url,
                metadata?.altText || null,
                null, // Dimensions
                file.size,
                JSON.stringify(metadata?.tags || [])
            ).run();

        } catch (error) {
            console.error('D1 Storage Upload Failed:', error);
            // Attempt rollback of blob if metadata failed
            try {
                await db.prepare('DELETE FROM media_blobs WHERE id = ?').bind(id).run();
            } catch (rollbackError) {
                console.error('Rollback failed:', rollbackError);
            }
            throw new Error('Failed to upload file to database.');
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

        if (updates.length > 1) { // >1 because updated_at is always there
            await db.prepare(`UPDATE media SET ${updates.join(', ')} WHERE id = ?`)
                .bind(...values)
                .run();
        }
    }

    async delete(url: string): Promise<void> {
        const db = await getD1Database();
        if (!db) throw new Error('D1 binding missing');

        // Extract ID from URL: /api/media/blob/UUID
        const parts = url.split('/');
        const id = parts[parts.length - 1];

        if (!id) throw new Error('Invalid URL');

        // Delete blob and metadata
        // Deleting the blob automatically frees up the space for quota calculation
        await db.batch([
            db.prepare('DELETE FROM media_blobs WHERE id = ?').bind(id),
            db.prepare('DELETE FROM media WHERE id = ?').bind(id) // Delete by ID directly
        ]);

        // Also support deleting by URL if needed for compatibility (e.g. if ID parsing fails)
        // But since we control the URL format, ID extraction is reliable.
    }

    async list(): Promise<MediaAsset[]> {
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
