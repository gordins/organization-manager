import { NextFunction, Request, Response } from 'express';

export class AuthenticationMiddleware {
    public use(_req: Request, _res: Response, next: NextFunction): void {
        next(); // To implement token verification
    }
}
