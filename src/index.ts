import "reflect-metadata";
import express, {Application, Request, Response, RequestHandler } from 'express';
import {router as userRouter } from './controllers/users';
import {router as loginRouter } from './controllers/login';

import { PORT } from './util/config';
import { connectToDatabase } from './util/db';

const app : Application = express();




app.use(express.json());

app.use('/api/users', userRouter);
app.use('/api/login', loginRouter);


const start = async () => {
    await connectToDatabase();
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

app.get('/', ( (_req : Request, res : Response) => {
    res.status(200).send({ message: `Hello world!` });
}) as RequestHandler);

start()
.catch(() => console.log("App failed at startup"));
