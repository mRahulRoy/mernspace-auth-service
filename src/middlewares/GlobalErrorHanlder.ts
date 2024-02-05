import { Request, Response, NextFunction } from 'express';
import { v4 as uuid4 } from 'uuid';
import { HttpError } from 'http-errors';
import logger from '../config/logger';
export const globalErrorHandler = (
    err: HttpError,
    req: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: NextFunction,
) => {
    const errorId = uuid4();
    const statusCode = err.statusCode || 500;
    const isProduction = process.env.NODE_ENV === 'production';
    const message = isProduction ? 'Internal server error' : err.message;
    logger.error(err.message, {
        id: errorId,
        statusCode,
        error: err.stack,
        path: req.path,
        method: req.method,
    });

    res.status(statusCode).json({
        errors: [
            {
                ref: errorId,
                type: err.name,
                message: message,
                path: req.path,
                method: req.method,
                location: 'Server',
                stack: isProduction ? null : err.stack,
            },
        ],
    });
};
