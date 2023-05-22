import express, { Request, Response} from 'express';
import { tokenExtractor } from '../util/middleware';
import { correctUser } from '../util/middleware';
import { Conversation } from '../models/conversation';
import { QuestionConversation } from '../models/questionConversation';
import { extractOptions, extractQuestion } from '../util/extractStructuredQuestion';
import { InitializationCheck } from '../models/InitializationCheck';
import { initializeQuestion } from './game';

interface subscriber {
    userId: number,
    gameId: number,
    questionOrder: number,
    response: Response
}


type subscribers = {[userId: string] : subscriber[] }

let subscribers : subscribers = {};

export const router = express.Router();

router.get('/:id/:questionOrder', tokenExtractor, correctUser, (async (_req: Request, res: Response) => {
    const gameId = Number(_req.params.id);
    const questionOrder = Number(_req.params.questionOrder);

    if( isNaN(gameId) || isNaN(questionOrder) ) {
        res.status(400).json({error: `GameId ${gameId} or question order ${questionOrder} is not a number.`})
        return
    }

    const headers = {
      'Content-Type': 'text/event-stream',
      'Connection': 'keep-alive',
      'Cache-Control': 'no-cache'
    };

    res.writeHead(200, headers);

    const userId = res.locals.decodedToken.id as number;


    const sub = {
        userId: userId,
        gameId: gameId,
        questionOrder: questionOrder,
        response: res
    }

    if (userId in subscribers) {
        subscribers[userId].push(sub);
    } else {
        subscribers[userId] = [sub];
    }

    // if ready, respond immediately and end res
    await notifySubscriber(userId, gameId, questionOrder);

    // check if question has been initialized, if not, do it now
    const initialCheck = await InitializationCheck.findOne({where: {
        gameId: gameId,
        questionOrder: questionOrder
    }})

    if(!initialCheck) {
        await initializeQuestion(gameId, questionOrder, userId);
    }


    _req.on('close', () => {
        console.log(`Connection closed for user ${userId}, game: ${gameId} and question ${questionOrder}`)
        //subscribers = subscribers.filter(subscriber => subscriber.userId !== userId)

        subscribers[userId] = subscribers[userId].filter((sub: subscriber) => {
            if(sub.gameId === gameId && sub.questionOrder === questionOrder) {
                return false 
            } else { 
                return true;
            }
        })

        if (subscribers[userId].length === 0) {
            delete subscribers[userId]
        }

    })

}));


router.post('/:id/:questionOrder', tokenExtractor, (async ( _req : Request, res: Response) => {
    const userId = res.locals.decodedToken.id as number;
    const gameId = Number(_req.params.id);
    const questionOrder = Number(_req.params.questionOrder);

    if( isNaN(gameId) || isNaN(questionOrder) ) {
        res.status(400).json({error: `GameId ${gameId} or question order ${questionOrder} is not a number.`})
        return
    }


    await notifySubscriber(userId,gameId,questionOrder);

    console.log(subscribers);

    res.status(200).json({success: true})
}))



export async function notifySubscriber(userId: number, gameId: number, questionOrder: number) {
    // check if user subscribed
    if(!subscribers[userId] 
        || subscribers[userId].filter((sub) => {
            if(sub.gameId === gameId && sub.questionOrder === questionOrder) {
                return true 
            } else { 
                return false;
            }
        }).length === 0) {
            // do nothing if not subscribed
            return
        }

    // check if both conversation and questions are ready
    const conversationPromise = Conversation.findOne({
        where: {
            gameId: gameId,
            questionOrder: questionOrder,
            role: "assistant"
        }
    })

    const questionConvoPromise = QuestionConversation.findOne({
        where: {
            gameId: gameId,
            questionOrder: questionOrder,
            role: "assistant"
        }
    })

    const [convo, questionConvo] = await Promise.all([conversationPromise, questionConvoPromise]);

    if(!convo || !questionConvo) {
        // do nothing if one of them not ready
        return
    } else {
        // notify all subscriptions
        const data = {
            intro: convo.content,
            question: extractQuestion(questionConvo.content),
            options: extractOptions(questionConvo.content)
        }
        

        if(!data.question || !data.options) {
            subscribers[userId].forEach((sub) => {
                if(sub.gameId === gameId && sub.questionOrder === questionOrder) {
                    sub.response
                    .end()
                }
            })
            return
        }

        subscribers[userId].forEach((sub) => {
            if(sub.gameId === gameId && sub.questionOrder === questionOrder) {
                sub.response.write(`data: ${JSON.stringify(data)}\n\n`)
                sub.response.end();
            }
        })
    }
}