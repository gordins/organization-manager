import { config } from 'dotenv';
import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

import { DatabaseConnection } from '../common/connections/database.connection';
import { Context } from '../common/context';
import { Logger } from '../common/logger';

export class MigrationsBootstrap {
    private readonly db: DatabaseConnection;

    constructor() {
        config();

        this.db = new DatabaseConnection({
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE
        });
    }

    async run(ctx: Context): Promise<void> {
        try {
            await this.db.connect(ctx);

            const migrationPath = join(__dirname, 'migrations');
            const files = readdirSync(migrationPath).sort();

            for (const file of files) {
                const filePath = join(migrationPath, file);
                if (statSync(filePath).isFile()) {
                    const sql = readFileSync(filePath, 'utf-8');
                    Logger.info(ctx, `Executing migration: ${file}.\nSQL:\n ${sql}`);
                    await this.db.execute(ctx, sql);
                }
            }

            Logger.info(ctx, 'All migrations run successfully!');
        } catch (error) {
            Logger.error(ctx, 'Migration error:', error);
        } finally {
            await this.db.disconnect(ctx);
        }
    }
}
