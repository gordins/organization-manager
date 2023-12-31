import Redis from 'ioredis';

import { Context } from '../context';
import { Logger } from '../logger';

export class CacheConnection {
    private client: Redis | null = null;

    constructor(private readonly url: string) {}

    public async connect(ctx: Context): Promise<void> {
        try {
            this.client = new Redis(this.url);

            this.client.on('connect', () => {
                Logger.info(ctx, 'Connected to Redis successfully!');
            });

            this.client.on('error', err => {
                Logger.error(ctx, 'Redis connection error', err);
            });

            await this.client.connect();
        } catch (error) {
            Logger.error(ctx, 'Failed to connect to Redis:', error);
            throw error;
        }
    }

    public async disconnect(_ctx: Context): Promise<void> {
        if (this.client) {
            await this.client.quit();
            this.client = null;
        }
    }

    public async get(key: string): Promise<string | null> {
        if (!this.client) {
            throw new Error('Must connect to Redis before getting values.');
        }

        return this.client.get(key);
    }

    public async set(key: string, value: string): Promise<void> {
        if (!this.client) {
            throw new Error('Must connect to Redis before setting values.');
        }

        await this.client.set(key, value);
    }

    public async invalidate(key: string): Promise<void> {
        if (!this.client) {
            throw new Error('Must connect to Redis before invalidating keys.');
        }

        await this.client.del(key);
    }
}
