import express, {RequestHandler, Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import { SECRET } from '../util/config';
import bcrypt from 'bcrypt';

import { User } from '../models/user';


export const router = express.Router();

const correctInputFormat =  (_req : Request, res : Response, next: NextFunction) => {
    if(!(_req.body.username && _req.body.password)) {
        res.status(400).json({error: "Input does not contain username or password"});
    } else {
        next();
    }
};


const userExists = (async (_req : Request, res : Response, next: NextFunction) => {
    const user = await User.findOne({
        where: {
            username: _req.body.username as string
        }
    });


    if(!user) {
        res.status(404).json({error: "User does not exists."});
    } else {
        res.locals.user = user ;
        next();
    }
}) as RequestHandler;

const passwordMatch = (async (_req: Request, res: Response, next: NextFunction) => {

    const match = await bcrypt.compare(_req.body.password as string, res.locals.user.password as string);

    if(!match) {
        res.status(400).json({error: "Password for the given username is not correct."});
    }

    next();
}) as RequestHandler;


router.post('/', correctInputFormat, userExists,  passwordMatch, (  (_req:Request, res:Response ) => {
    try {
        const user = res.locals.user as User;
        const token = jwt.sign({username: user.username, id: user.id}, SECRET as string);

        res.status(200).send({token, username: user.username, name: user.name});

    } catch(error) {    
        res.status(400).json({error});
    }
}) as RequestHandler );
