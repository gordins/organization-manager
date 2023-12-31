import { NextFunction, Request, Response } from 'express';
import { Context } from '../common/context';
import { Logger } from '../common/logger';

export class ErrorHandlingMiddleware {
    public use(err: Error, req: Request, res: Response, _next: NextFunction): void {
        const ctx = (req as any).ctx || new Context();

        const message = `Unexpected error for HTTP ${req.method} URL:${req.url}`;
        Logger.error(ctx, message, err);

        res.status(500).json({ message: err.message || 'Internal Server Error' });
    }
}
