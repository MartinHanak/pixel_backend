import express, {RequestHandler, Request, Response} from 'express';
import { tokenExtractor } from '../util/middleware';
import { Game } from '../models/game';
import { Conversation, roleType } from '../models/conversation';
import { QuestionConversation } from '../models/questionConversation';
import { InitializationCheck } from '../models/InitializationCheck';

import { chatGPTInterface, message } from '../models/chatgpt';


export const router = express.Router();


// get the newest created gameID
router.get('/', tokenExtractor, ( async (_req: Request, res: Response) => {

    // get id and username from extracted token
    const userId = res.locals.decodedToken.id as number;

    const game = await Game.findOne({
        where: { userId : userId },
        order: [['createdAt', 'DESC']]
    })

    if(game) {
        res.status(200).json({gameId: game.id})
    } else {
        res.status(404).json({ error: "No game found for given user."})
    }

}) as RequestHandler)



// create game
router.post('/', tokenExtractor, ( async (_req : Request, res: Response) => {

    // get id and username from extracted token
    const userId = res.locals.decodedToken.id as number;
    console.log(userId)

    // always create a new game
    const game = await Game.create({
        userId: userId,
        correctlyAnswered: 0,
        numberOfQuestions: 16
        })


    res.status(200).json({gameId: game.id});

}) as RequestHandler)



// get all info for given game id
router.get('/:id', tokenExtractor, ( async (_req: Request, res: Response) => {

    // get id and username from extracted token
    const userId = res.locals.decodedToken.id as number;

    const gameId = _req.params.id;

    const game = Game.findOne({
        where: { id: gameId}
    })

    const conversation = Conversation.findAll({
        where: { gameId: gameId }
    })

    const questionConversation = QuestionConversation.findAll({
        where: { gameId: gameId }
    })


    const combinedPromise = await Promise.all([game, conversation, questionConversation]);

    if(combinedPromise[0] && combinedPromise[1] && combinedPromise[2]) {
        if(combinedPromise[0].userId === userId) {

            res.status(200).json({
                game: combinedPromise[0], 
                conversation: combinedPromise[1], 
                questionConversation: combinedPromise[2]
            })
            return

        } else {
            res.status(401).json({error: "User is not authorized to view this game."})
            return
        }
    } else {
        res.status(400).json({error: `Could not retrieve info about game ${gameId}.`});
        return
    }
    
}) as RequestHandler)


// get only conversation and questionConversation for the specific question order

router.get('/:id/:questionOrder', tokenExtractor, (async (_req: Request, res: Response) => {

    const gameId = _req.params.id;
    const questionOrder = _req.params.questionOrder;
    // get id and username from extracted token
    const userId = res.locals.decodedToken.id as number;

    const game = Game.findOne({
        where: { id: gameId}
    })

    const conversation = Conversation.findAll({
        where: { gameId: gameId, questionOrder: questionOrder }
    })

    const questionConversation = QuestionConversation.findAll({
        where: { gameId: gameId, questionOrder: questionOrder }
    })

    
    const combinedPromise = await Promise.all([game, conversation, questionConversation]);

    if(combinedPromise[0] && combinedPromise[1] && combinedPromise[2]) {
        if(combinedPromise[0].userId === userId) {

            res.status(200).json({
                game: combinedPromise[0], 
                conversation: combinedPromise[1], 
                questionConversation: combinedPromise[2]
            })
            return

        } else {
            res.status(401).json({error: "User is not authorized to view this game."})
            return
        }
    } else {
        res.status(400).json({error: `Could not retrieve info about game ${gameId} and question order ${questionOrder}.`});
        return
    }

    
}) as RequestHandler)


// if post request for specific game id and question order, initilze chatGPT generation if not already done
router.post('/:id/:questionOrder', tokenExtractor, (async (_req: Request, res: Response) => {

    // check if already initialized and correct user
    const gameId = Number(_req.params.id);
    const questionOrder = Number(_req.params.questionOrder);

    if( isNaN(gameId) || isNaN(questionOrder) ) {
        res.status(400).json({error: `GameId ${gameId} or question order ${questionOrder} is not a number.`})
        return
    }

    const game = await Game.findOne({where: {id: gameId }});

    if(!game) {
        res.status(404).json({error: `Could not find game with id ${gameId}`})
        return
    }

    const initializedCheck = await InitializationCheck.findOne({
        where: {
            gameId: gameId,
            questionOrder: questionOrder
        }
    })

    if(initializedCheck && initializedCheck.initialized) {
        res.status(200).json({message: `Question with order ${questionOrder} for the game with id ${gameId} was already initialized.`});
        return
    } 

    // if not initialized, initialize now
    await InitializationCheck.create({
        gameId: gameId,
        questionOrder: questionOrder,
        initialized: true
    })


    // create new

        // get previous conversation
        const convoPromise = Conversation.findAll({
            where: {
                gameId: gameId
            }
        })

        const questionPromise = QuestionConversation.findAll({
            where: {
                gameId: gameId
            }
        })

        const [previousConversation, previousQuestions] = await Promise.all([convoPromise, questionPromise])

        // request new one
        const previousConvoMessages = previousConversation.map((convoElement: Conversation) => {
            const message: message = {
                role: convoElement.role as roleType,
                content: convoElement.content
            }
            return message;
        })
        const previousQuestionMessages = previousQuestions.map((questionElement: QuestionConversation) =>{
            const message: message = {
                role: questionElement.role as roleType,
                content: questionElement.content
            }
            return message;
        })

        const newConversationMessage =  chatGPTInterface.getNextIntroduction(gameId, questionOrder, previousConvoMessages);
        const newQuestionMessage =  chatGPTInterface.getNextQuestion(gameId, questionOrder, previousQuestionMessages);


        // queue processing of the chatGPT response before responding, but do not await
        newConversationMessage.then((chatGPTResponse) => {
            const newMessage : message = chatGPTResponse.choices[0].message;

            Conversation.create({
                gameId: gameId,
                role: newMessage.role,
                content: newMessage.content,
                questionOrder: questionOrder
            })
            console.log("message ready")
            console.log(newMessage)
        })

        newQuestionMessage.then((chatGPTResponse) => {
            const newMessage : message = chatGPTResponse.choices[0].message;

            QuestionConversation.create({
                gameId: gameId,
                role: newMessage.role,
                content: newMessage.content,
                questionOrder: questionOrder
            })

            console.log("message ready")
            console.log(newMessage)
        })

        // respond
        res.status(200).json({message: `Question ${questionOrder} initialized.`})
        //res.status(200).json({message: `Question ${questionOrder} initialized.`})

}) as RequestHandler)