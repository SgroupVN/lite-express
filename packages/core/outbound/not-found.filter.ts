import type { Handler, Request, Response } from 'express';

export const notFoundHandler: Handler = (req: Request, res: Response) => {
    return res.status(404).json({
        message: `Can not ${req.method} ${req.path}`,
    });
}
