
import type { MediaStorage, MediaAsset } from './MediaStorage';

// Dynamic import helpers for filesystem operations (Dev only)
async function getFs() {
    if (process.env.NODE_ENV === 'development') {
        const fs = await import('fs');
        return fs.default || fs;
    }
    return null;
}

async function getPath() {
    if (process.env.NODE_ENV === 'development') {
        const path = await import('path');
        return path.default || path;
    }
    return null;
}

export class LocalStorage implements MediaStorage {
    private mediaJsonPath: string;
    private publicMediaPath: string;

    constructor() {
        // We can't synchronously use path/process.cwd here if valid
        // But we can initialize paths lazily in methods
        this.mediaJsonPath = '';
        this.publicMediaPath = '';
    }

    getName(): string {
        return 'local';
    }

    async getUsage(): Promise<{ used: number; limit?: number }> {
        if (process.env.NODE_ENV !== 'development') return { used: 0, limit: 0 };
        const assets = await this.readMetadata();
        const used = assets.reduce((sum, asset) => sum + (asset.size || 0), 0);

        // Logical limit for dev environment
        const limit = 500 * 1024 * 1024;

        return { used, limit };
    }

    private async initPaths() {
        const path = await getPath();
        if (!path) throw new Error('Filesystem not available');

        this.mediaJsonPath = path.join(process.cwd(), 'src', 'data', 'media.json');
        this.publicMediaPath = path.join(process.cwd(), 'public', 'media', 'dev-uploads');
    }

    private async ensureData() {
        const fs = await getFs();
        if (!fs) return;

        if (!this.mediaJsonPath) await this.initPaths();

        // Ensure public/media exists
        if (!fs.existsSync(this.publicMediaPath)) {
            await fs.promises.mkdir(this.publicMediaPath, { recursive: true });
        }

        // Ensure media.json exists
        if (!fs.existsSync(this.mediaJsonPath)) {
            await fs.promises.writeFile(this.mediaJsonPath, JSON.stringify([]), 'utf-8');
        }
    }

    private async readMetadata(): Promise<MediaAsset[]> {
        const fs = await getFs();
        if (!fs) return [];
        await this.ensureData();

        try {
            const content = await fs.promises.readFile(this.mediaJsonPath, 'utf-8');
            return JSON.parse(content);
        } catch (e) {
            console.error('Failed to read local media metadata:', e);
            return [];
        }
    }

    private async writeMetadata(assets: MediaAsset[]): Promise<void> {
        const fs = await getFs();
        if (!fs) return;
        await this.ensureData();

        await fs.promises.writeFile(this.mediaJsonPath, JSON.stringify(assets, null, 2), 'utf-8');
    }

    async upload(file: File, metadata?: { altText?: string; caption?: string; tags?: string[] }): Promise<string> {
        const fs = await getFs();
        const path = await getPath();
        if (!fs || !path) throw new Error('Filesystem not available');

        await this.ensureData();

        const timestamp = Date.now();
        const safeFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const filename = `${timestamp}-${safeFilename}`;
        const filePath = path.join(this.publicMediaPath, filename);

        const bytes = await file.arrayBuffer();
        await fs.promises.writeFile(filePath, new Uint8Array(bytes));

        const url = `/media/dev-uploads/${filename}`;
        const id = crypto.randomUUID();

        const asset: MediaAsset = {
            id,
            filename: url.split('/').pop() || 'unknown',
            url,
            altText: metadata?.altText,
            tags: metadata?.tags || [],
            size: file.size,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            provider: 'local'
        };

        const assets = await this.readMetadata();
        assets.unshift(asset); // Add to beginning
        await this.writeMetadata(assets);

        return url;
    }

    async update(id: string, metadata: { altText?: string; caption?: string; tags?: string[] }): Promise<void> {
        const assets = await this.readMetadata();
        const index = assets.findIndex(a => a.id === id);

        if (index === -1) throw new Error('Asset not found');

        const { caption, ...validMetadata } = metadata;

        assets[index] = {
            ...assets[index],
            ...validMetadata,
            updatedAt: new Date().toISOString()
        };

        await this.writeMetadata(assets);
    }

    async delete(url: string): Promise<void> {
        const fs = await getFs();
        const path = await getPath();
        if (!fs || !path) throw new Error('Filesystem not available');
        await this.ensureData();

        // Extract filename from URL (/media/filename.jpg)
        const basename = url.split('/').pop();
        if (!basename) throw new Error('Invalid URL');

        const filePath = path.join(this.publicMediaPath, basename);

        // Delete file if exists
        if (fs.existsSync(filePath)) {
            await fs.promises.unlink(filePath);
        }

        // Update metadata
        const assets = await this.readMetadata();
        const newAssets = assets.filter(a => a.url !== url);
        await this.writeMetadata(newAssets);
    }

    async list(): Promise<MediaAsset[]> {
        if (process.env.NODE_ENV !== 'development') return [];
        return this.readMetadata();
    }

    async get(id: string): Promise<MediaAsset | null> {
        if (process.env.NODE_ENV !== 'development') return null;
        const assets = await this.readMetadata();
        return assets.find(a => a.id === id) || null;
    }
}
