import express, {RequestHandler, Request, Response} from 'express';
import { User } from '../models/user';

export const router = express.Router();


router.get('/', (async(_req : Request, res: Response) => {
    const users = await User.findAll();
    res.json(users);
}) as RequestHandler);
