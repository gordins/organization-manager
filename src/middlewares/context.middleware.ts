import { NextFunction, Request, Response } from 'express';
import { Context, Runtime } from '../common/context';

export class ContextMiddleware {
    public use(req: Request, res: Response, next: NextFunction): void {
        if (!(req as any).ctx) {
            (req as any).ctx = new Context(Runtime.Server);
        }
        next();
    }
}
