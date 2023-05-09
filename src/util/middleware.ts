import { Request, Response, NextFunction, RequestHandler, ErrorRequestHandler} from 'express';
import jwt from 'jsonwebtoken';
import { SECRET } from './config';
import { Game } from '../models/game';

export const tokenExtractor = ( (_req: Request, res: Response, next: NextFunction) => {
    const authorization = _req.get('authorization');

    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        try {
            res.locals.decodedToken = jwt.verify(authorization.substring(7), SECRET as string);
            next();
        } catch {
             res.status(401).json({ error: 'token invalid' });
        }
    } else {
         res.status(401).json({error: 'token not found'});
    }

}) as RequestHandler;


export const correctUser = ( async (_req: Request, res: Response, next: NextFunction) => {
    // from previous middleware
    const userId = res.locals.decodedToken.id as number;

    if(!userId) {
        res.status(400).json({error: 'no user id found in the received token'})
        return
    }

    const gameId = Number(_req.params.id);

    if(!gameId) {
        res.status(400).json({error: 'No game id found in request parameters.'})
        return
    }

    const game = await Game.findOne({
        where: {
            id: gameId
        }
    })

    if(!game) {
        res.status(400).json({error: `Game with the given id of ${gameId} was not found`})
        return
    } else if(game.userId !== userId) {
        res.status(401).json({error: 'Current user is not authorized to interact with this game'})
        return
    } 
    
    next()

}) as RequestHandler;


export const errorHandler = ((error, _request, res, next) => {

  console.log(error.message)

  res.status(400).json({error: error.message})

  next(error)
}) as ErrorRequestHandler