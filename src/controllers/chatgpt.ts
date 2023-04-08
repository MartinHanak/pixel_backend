import express, {RequestHandler, Request, Response} from 'express';

export const router = express.Router();

import { chatGPTInterface } from '../models/chatgpt';


router.get('/', (( _req:Request, res: Response) => {
    res.status(200).json({message: "ChatGPT api online"});
}) as RequestHandler)


router.post('/', (async (_req: Request, res:Response ) => {
    
    try {

        const response = await chatGPTInterface.getNextQuestion(0,0);

        res.status(200).send(response);


    } catch(err) {
        res.status(400).json({error: err})
    }

} ) as RequestHandler);
