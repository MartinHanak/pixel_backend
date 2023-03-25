import "reflect-metadata";
import express, { Application, Request, Response, RequestHandler } from 'express';
import { router as userRouter } from './controllers/users';
import { router as loginRouter } from './controllers/login';
import { router as chatgptRouter } from './controllers/chatgpt';

const app : Application = express();
export default app;


app.use(express.json());

app.use('/api/users', userRouter);
app.use('/api/login', loginRouter);
app.use('/api/chatgpt', chatgptRouter);


app.get('/', ( (_req : Request, res : Response) => {
    res.status(200).send({ message: `Hello world!` });
}) as RequestHandler);

