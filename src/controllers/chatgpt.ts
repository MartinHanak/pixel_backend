import express, {RequestHandler, Request, Response} from 'express';

export const router = express.Router();

import { chatGPTInterface, message } from '../models/chatgpt';


router.get('/', ( async ( _req:Request, res: Response) => {
    if(!_req.query.prompt) {
        return res.status(200).json({message: "ChatGPT api online. Include prompt parameter to get a generic response."});
    } else {
        try {

            const message: message = {role: 'user', content: _req.query.prompt as string}

            const response = await chatGPTInterface.getGenericResponse([message], 0.8)

            return res.status(200).send(response);

        } catch(error) {
            return res.status(400).json({error: error})
        }
    }
}) as RequestHandler)


router.post('/', (async (_req: Request, res:Response ) => {

    
    try {

        const prompt = _req.body.prompt;
        if(!prompt) {
            throw new Error('No prompt in request body provided');
        }

        const message: message = {role: 'user', content: prompt}

        const response = await chatGPTInterface.getGenericResponse([message], 0.8)

        res.status(200).send(response);


    } catch(err) {
        res.status(400).json({error: err})
    }

} ) as RequestHandler);
