import { Request, Response, NextFunction, RequestHandler} from 'express';
import jwt from 'jsonwebtoken';
import { SECRET } from './config';

export const tokenExtractor = ( (_req: Request, res: Response, next: NextFunction) => {
    const authorization = _req.get('authorization');

    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        try {
            res.locals.decodedToken = jwt.verify(authorization.substring(7), SECRET as string);
        } catch {
            return res.status(401).json({ error: 'token invalid' });
        }
    } else {
        return res.status(401).json({error: 'token not found'});
    }

    next();

}) as RequestHandler;