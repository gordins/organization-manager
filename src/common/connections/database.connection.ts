import { createPool, Pool } from 'mysql2/promise';

import { Context } from '../context';
import { Logger } from '../logger';

export type DatabaseConfig = {
    host?: string;
    user?: string;
    password?: string;
    database?: string;
};

export class DatabaseConnection {
    private pool: Pool;

    constructor(private readonly config: DatabaseConfig) {
        this.pool = createPool(this.config);
    }

    public async connect(ctx: Context): Promise<void> {
        try {
            const connection = await this.pool.getConnection();
            connection.release();
            Logger.info(ctx, 'Database connected successfully!');
        } catch (error) {
            Logger.error(ctx, 'Database connection failed', error);
            throw error;
        }
    }

    public async disconnect(_ctx: Context): Promise<void> {
        await this.pool.end();
    }

    public async execute(ctx: Context, sql: string, params?: any[]): Promise<any> {
        try {
            const [rows] = await this.pool.execute(sql, params);
            return this.convertKeysToCamel(rows);
        } catch (error) {
            Logger.error(ctx, `Failed to execute query: ${sql}`, error);
            throw error;
        }
    }

    private snakeToCamel(s: string): string {
        return s.replace(/(_\w)/g, k => k[1].toUpperCase());
    }

    private convertKeysToCamel(o: any): any {
        if (o instanceof Array) {
            return o.map(i => this.convertKeysToCamel(i));
        } else if (o instanceof Object && !(o instanceof Date)) {
            const n: any = {};
            Object.keys(o).forEach(k => {
                n[this.snakeToCamel(k)] = this.convertKeysToCamel(o[k]);
            });
            return n;
        }
        return o;
    }
}
