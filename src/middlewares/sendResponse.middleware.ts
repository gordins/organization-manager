import { NextFunction, Request, Response } from 'express';
import { Context } from '../common/context';

export const sendResponse =
    (method: Function) =>
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const ctx: Context = (req as any).ctx;
            const result = await method(ctx, { ...req.params, ...req.query }, req.body);

            if (result.data) {
                res.status(result.status).json(result.data);
            } else {
                res.status(result.status).send(result.message);
            }
        } catch (error) {
            next(error);
        }
    };
