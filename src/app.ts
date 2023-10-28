import 'reflect-metadata';
import express, { NextFunction, Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import logger from './config/logger';
import { HttpError } from 'http-errors';
const app = express();
import authRouter from './routes/auth';

app.use(cookieParser());
app.use(express.json());

app.get('/', async (req, res) => {
    res.status(200).send(`<h1>Welcome to mern practice</h1>`);
});
app.use('/auth', authRouter);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
    logger.error(err.message);
    // logger.error(err);

    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        errors: [
            {
                type: err.name,
                msg: err.message,
                path: '',
                location: '',
            },
        ],
    });
});

export default app;
