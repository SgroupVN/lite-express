import type { Handler, Request, Response } from 'express';
import { NOT_FOUND } from 'http-status';

export const notFoundHandler: Handler = (req: Request, res: Response) => {
    return res.status(NOT_FOUND).json({
        message: `Can not ${req.method} ${req.path}`,
    });
}
