import express, {RequestHandler, Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import { SECRET } from '../util/config';
import bcrypt from 'bcrypt';

import { User } from '../models/user';


export const router = express.Router();

/*
const correctInputFormat =  (_req : Request, res : Response, next: NextFunction) => {
    if(!(_req.body.username && _req.body.password)) {
        res.status(400).json({error: "Input does not contain username or password"});
    }
    next();
};


const userExists = (async (_req : Request, res : Response, next: NextFunction) => {
    const user = await User.findOne({
        where: {
            username: _req.body.username as string
        }
    });

    if(!user) {
        res.status(401).json({error: "User does not exists."});
    } else {
        res.locals.id = user.id;
        res.locals.username = user.username;
        res.locals.password = user.password;

        next();
    }
}) as RequestHandler;

const passwordMatch = (async (_req: Request, res: Response, next: NextFunction) => {

    const match = await bcrypt.compare(_req.body.password as string, res.locals.password as string);

    if(!match) {
        res.status(400).json({error: "Password for the given username is not correct."});
    }

    next();
}) as RequestHandler;
*/


router.post('/', ( async (_req:Request, res:Response ) => {
    try {
        // correct format
        if(_req.body.username && _req.body.password) {

            // user exists
            const user = await User.findOne({
                where: {
                    username: _req.body.username as string
                }
            });

            if(!user) {
                res.status(401).json({error: "User does not exists."});
            } else {

                // password match
                const passwordMatch = await bcrypt.compare(_req.body.password as string, user.password);

                if(passwordMatch) {

                    // create token
                    const token = jwt.sign({username: user.username, id: user.id}, SECRET as string);
                    res.status(200).send({token, username: user.username, name: user.name});

                } else {
                    res.status(400).json({error: "Password for the given username is not correct."});
                }
            }
        } else {
             res.status(400).json({error: "Input does not contain username or password."});
        }

    } catch(error) {
        res.status(400).json({error});
    }
}) as RequestHandler); 
