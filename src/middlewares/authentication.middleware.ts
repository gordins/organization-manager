import { NextFunction, Request, Response } from 'express';

export class AuthenticationMiddleware {
    public use(_req: Request, _res: Response, next: NextFunction): void {
        next(); // To implement token verification
    }
}
// const token = req.header('Authorization')?.split(' ')[1];

// if (!token) return res.status(401).send('Access Denied: No token provided.');

// try {
//     const verified = verify(token, 'your-secret-key') as UserPayload;
//     req.user = verified;
//     next();
// } catch (error) {
//     res.status(400).send('Invalid Token');
// }

// if (req.user && req.user.role === 'admin') {
//     next();
// } else {
//     res.status(403).send('Admin resource! Access denied.');
// }
