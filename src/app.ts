import 'reflect-metadata';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
const app = express();
import authRouter from './routes/auth';
import tenantRouter from './routes/tenant';
import userRouter from './routes/user';
import { globalErrorHandler } from './middlewares/GlobalErrorHanlder';

app.use(cookieParser());
app.use(
    cors({
        //todo : move this to env
        origin: ['http://localhost:5173'],
        credentials: true,
    }),
);
app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.status(200)
        .send(` <div style="height:90vh;width:100%;display:flex;justify-content:center;align-items:center;flex-direction:column">
    <h2 style="font-family:cursive">Welcome Back, Rahul</h2>
    <h2 style="font-family:cursive">You are so cool ;)</h2>
  </div>`);
});

// registering routes
app.use('/auth', authRouter);
app.use('/tenants', tenantRouter);
app.use('/users', userRouter);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use(globalErrorHandler);

export default app;
