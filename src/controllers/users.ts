import express, {RequestHandler, Request, Response} from 'express';
import { User, UserCreationAttribues } from '../models/user';
import bcrypt from 'bcrypt';

import jwt from 'jsonwebtoken';
import { SECRET } from '../util/config';

export const router = express.Router();

// get all users
router.get('/', ( async (_req : Request, res: Response) => {
    const users = await User.findAll();
    res.json(users);
}) as RequestHandler);


const isValidUserInput = (input: any): input is UserCreationAttribues => {
    if(input.username && input.password ) {
        return true;
    } else {
        return false;
    }
};

// get one user
router.get('/:id', ( async (_req: Request, res: Response) => {
    const user = await User.findByPk(_req.params.id);
    if(user) {
        res.json(user);
    } else {
        res.status(404).end();
    }
} ) as RequestHandler);

// create a new user
router.post('/', ( async (_req: Request, res: Response) => {
    try {

       if (isValidUserInput(_req.body)) {

        // check if unique
        const existingUser = await User.findOne({
            where: {
                username: _req.body.username
            }
        });

        if(existingUser) {
            res.status(400).json({error : "User with the given username already exists."});
        } else {
             // create a new user
            const passwordHash = await bcrypt.hash(_req.body.password, 10);

            const user = await User.create({
                username: _req.body.username,
                password: passwordHash,
            });

            const token = jwt.sign({username: user.username, id: user.id}, SECRET as string);

            res.status(201).json({username: user.username, token: token});

        }
       } else {
        res.status(400).json({error: "Input is not a valid user input"});
       }
    } catch(error) {
        res.status(400).json({error});
    }
}) as RequestHandler);