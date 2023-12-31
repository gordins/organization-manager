import { NextFunction, Request, Response } from 'express';

export class AuthorizationMiddleware {
    public use(_req: Request, _res: Response, next: NextFunction): void {
        next(); // To implement role authorization
    }
}
