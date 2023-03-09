import "reflect-metadata";
import express, {Application, Request, Response, RequestHandler } from 'express';
import {router as userRouter } from './controllers/users';
import {router as loginRouter } from './controllers/login';

const app : Application = express();
export default app;


app.use(express.json());

app.use('/api/users', userRouter);
app.use('/api/login', loginRouter);


app.get('/', ( (_req : Request, res : Response) => {
    res.status(200).send({ message: `Hello world!` });
}) as RequestHandler);

