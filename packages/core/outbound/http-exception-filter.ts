import type { ErrorRequestHandler } from 'express';
import { HttpException } from '../http/http-exception/http.exception';
import { ERROR_CODE } from '../http/http-exception/error.enum';
import { INTERNAL_SERVER_ERROR } from 'http-status';

export const httpExceptionHandler: ErrorRequestHandler = (err, req, res, next) => {
    if (err instanceof HttpException) {
        return res.status(err.status).json({
            code: err.code,
            message: err.message,
            origin: req.originalUrl
        });
    }

    if (err instanceof Error) {
        return res.status(INTERNAL_SERVER_ERROR).json({
            code: ERROR_CODE.INTERNAL,
            message: err.message,
            origin: req.originalUrl
        });
    }

    return next();
}
