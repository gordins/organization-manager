import { Context } from './context';

export class Logger {
    public static info(ctx: Context, message: string, data?: any): void {
        this.log(ctx, LogLevel.INFO, message, data);
    }

    public static error(ctx: Context, message: string, data?: any): void {
        this.log(ctx, LogLevel.ERROR, message, data);
    }

    public static warn(ctx: Context, message: string, data?: any): void {
        this.log(ctx, LogLevel.WARN, message, data);
    }

    public static debug(ctx: Context, message: string, data?: any): void {
        this.log(ctx, LogLevel.DEBUG, message, data);
    }

    private static log(ctx: Context, level: LogLevel, message: string, data?: any): void {
        const logMessage = `[${level}]: ${message}`;

        const dataString = data ? `\nData: ${JSON.stringify(data, null, 2)}` : '';

        const contextString = `\nContext: ${JSON.stringify(ctx, null, 2)}`;

        const finalLogMessage = `${logMessage}${dataString}${contextString}`;

        switch (level) {
            case LogLevel.DEBUG:
                console.debug(finalLogMessage);
                break;
            case LogLevel.INFO:
                console.info(finalLogMessage);
                break;
            case LogLevel.WARN:
                console.warn(finalLogMessage);
                break;
            case LogLevel.ERROR:
                console.error(finalLogMessage);
                break;
        }
    }
}

export enum LogLevel {
    DEBUG = 'DEBUG',
    INFO = 'INFO',
    WARN = 'WARN',
    ERROR = 'ERROR'
}
