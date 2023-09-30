import 'reflect-metadata';
import express, { NextFunction, Request, Response } from 'express';
import logger from './config/logger';
import { HttpError } from 'http-errors';
const app = express();
import authRouter from './routes/auth';

app.use(express.json());

app.get('/', async (req, res) => {
    res.status(200).send(`<h1>Welcome to mern practice</h1>`);
});
app.use('/auth', authRouter);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
    logger.error(err.message);
    const statusCode = err.statusCode;
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
