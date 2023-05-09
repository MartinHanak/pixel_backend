import express, { Request, Response} from 'express';
import { correctUser, tokenExtractor } from '../util/middleware';
import { chatGPTInterface, message } from '../models/chatgpt';
import { HelpConversation } from '../models/helpConversation';
import { roleType } from '../models/conversation';

interface subscriber {
    userId: number,
    gameId: number,
    questionOrder: number,
    response: Response
}


type subscribers = {[userId: string] : subscriber[] }

let subscribers : subscribers = {};

export const router = express.Router();


router.post('/:id/:questionOrder', tokenExtractor, correctUser, (async(_req: Request, res: Response) => {

    const gameId = Number(_req.params.id);
    const questionOrder = Number(_req.params.questionOrder);

    if( isNaN(gameId) || isNaN(questionOrder) ) {
        res.status(400).json({error: `GameId ${gameId} or question order ${questionOrder} is not a number.`})
        return
    }

    if(!_req.body.selectedCharacter) {
        res.status(400).json({error: 'No character selected'})
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

    // check body for: selected character and maybe a first message from the user?


    if( _req.body.playerMessage) {
        // create a new message

        const newMessage: message = {
            role: 'user',
            content: _req.body.playerMessage
        }

        await HelpConversation.create({
            gameId:gameId,
            questionOrder:questionOrder,
            role: newMessage.role,
            content: newMessage.content
        })
    }

    const previousConvo = await HelpConversation.findAll({where: {
        gameId: gameId,
        questionOrder: questionOrder
    }})

    const previousMessages = previousConvo.map((convoElement:HelpConversation) => {
        const message: message = {
            role: convoElement.role as roleType,
            content: convoElement.content
        }
        return message;
    })

    const newMessagePromise = chatGPTInterface.getNextHelpMessage(_req.body.selectedCharacter,gameId,questionOrder,previousMessages)

    newMessagePromise.then((chatGPTResponse) => {
        const newMessage : message = chatGPTResponse.choices[0].message;
        console.log(newMessage)

        HelpConversation.create({
            gameId: gameId,
            questionOrder: questionOrder,
            role: newMessage.role,
            content: newMessage.content
        }).then(() => {
            // notify subscriber and end connection
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

            const data = {
                role: newMessage.role,
                content: newMessage.content
            }

            subscribers[userId].forEach((sub) => {
                if(sub.gameId === gameId && sub.questionOrder === questionOrder) {
                    sub.response.write(`data: ${JSON.stringify(data)}\n\n`)
                    sub.response.end();
                }
            })

        })
    })
    


    _req.on('close', () => {
        console.log(`Help connection closed for user ${userId}, game: ${gameId} and question ${questionOrder}`)
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

}))