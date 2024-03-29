import "reflect-metadata";
require('express-async-errors')
import express, { Application, Request, Response, RequestHandler } from 'express';
import cors from 'cors';
import { router as userRouter } from './controllers/users';
import { router as loginRouter } from './controllers/login';
import { router as chatgptRouter } from './controllers/chatgpt';
import { router as gameRouter } from './controllers/game';

import { router as gameRouterSSE } from './controllers/game_SSE';

import { errorHandler } from "./util/middleware";

const app : Application = express();
export default app;

app.use(cors());
app.use(express.json());

app.use('/api/users', userRouter);
app.use('/api/login', loginRouter);
app.use('/api/chatgpt', chatgptRouter);
app.use('/api/game', gameRouter );
app.use('/api/gameSSE', gameRouterSSE);

app.use(errorHandler);

app.get('/', ( (_req : Request, res : Response) => {
    res.status(200).send({ message: `Hello world!` });
}) as RequestHandler);

