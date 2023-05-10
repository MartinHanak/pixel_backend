import express, {RequestHandler, Request, Response} from 'express';
import { correctUser, tokenExtractor } from '../util/middleware';
import { Game } from '../models/game';
import { Conversation, roleType } from '../models/conversation';
import { QuestionConversation } from '../models/questionConversation';
import { InitializationCheck } from '../models/InitializationCheck';

import { chatGPTInterface, message } from '../models/chatgpt';
import { extractAnswer } from '../util/extractStructuredQuestion';
import { GameProgress } from '../models/gameProgress';
import { notifySubscriber } from './game_SSE';
import getStructuredQuestion from '../util/extractStructuredQuestion';
import { AvailableCharacters, availableCharacters } from '../models/characters';
import { HelpConversation } from '../models/helpConversation';


export const router = express.Router();

// get all games
router.get('/', tokenExtractor, ( async (_req: Request, res: Response) => {

    // get id and username from extracted token
    const userId = res.locals.decodedToken.id as number;

    const games = await Game.findAll({
        where: { userId : userId },
        order: [['createdAt', 'DESC']]
    })

    if(games) {
        res.status(200).json({games})
    } else {
        res.status(404).json({ error: "No game found for given user."})
    }

}) as RequestHandler)

// get newest game
router.get('/last', tokenExtractor, ( async (_req: Request, res: Response) => {

    // get id and username from extracted token
    const userId = res.locals.decodedToken.id as number;

    const lastGame = await Game.findOne({
        where: { userId : userId },
        order: [['createdAt', 'DESC']]
    })

    if(!lastGame) {
        res.status(404).json({ error: "No game found for given user."})
        return
    }

    let lastQuestionOrder = null;

    // find last questionOrder unanswered for the given game
    const gameProgress = await GameProgress.findOne({
        where: {
            gameId: lastGame.id
        },
        order:  [['createdAt', 'DESC']]
    })

    if(!gameProgress) {
        // no question answered yet
        lastQuestionOrder = 1;
    } else {
        // db has info about last answered question
        lastQuestionOrder = gameProgress.questionOrder + 1;
    }

    // check if it is not higher than max questions OR game over already
    if(lastGame.gameOver) {
        res.status(400).json({ error: `Game ${lastGame.id} has already finished.`})
        return
    } else if(lastQuestionOrder > lastGame.numberOfQuestions ) {
        res.status(400).json({ error: `Game ${lastGame.id} has already successfully finished.`})
        return
    }


    res.status(200).json({
        gameId: lastGame.id,
        questionOrder: lastQuestionOrder,
        numberOfQuestions: lastGame.numberOfQuestions
    })


}) as RequestHandler)


// get oldest questionOrder for specified id
router.get('/:id/last', tokenExtractor, ( async (_req: Request, res: Response) => {

    const gameId = Number(_req.params.id);
    let lastQuestionOrder = 0;

    const game = await Game.findOne({
        where: {
            id: gameId
        }
    })

    if(!game) {
        res.status(404).json({error: `Game ${gameId} not found`})
        return
    }

    // find last questionOrder unanswered for the given game
    const gameProgress = await GameProgress.findOne({
        where: {
            gameId: game.id
        },
        order:  [['createdAt', 'DESC']]
    })

    if(!gameProgress) {
        // no question answered yet
        lastQuestionOrder = 1;
    } else {
        // db has info about last answered question
        lastQuestionOrder = gameProgress.questionOrder + 1;
    }

    // check if it is not higher than max questions OR game over already
    if(game.gameOver) {
        res.status(400).json({ error: `Game ${game.id} has already finished.`})
        return
    } else if(lastQuestionOrder > game.numberOfQuestions ) {
        res.status(400).json({ error: `Game ${game.id} has already successfully finished.`})
        return
    }


    res.status(200).json({
        gameId: game.id,
        questionOrder: lastQuestionOrder,
        numberOfQuestions: game.numberOfQuestions
    })


}))


// create game
router.post('/', tokenExtractor, ( async (_req : Request, res: Response) => {

    // get id and username from extracted token
    const userId = res.locals.decodedToken.id as number;
    console.log(userId)

    let theme = null;

    if(_req.body.theme && _req.body.theme !== '') {
        theme = _req.body.theme
    }

    // always create a new game
    const game = await Game.create({
        userId: userId,
        correctlyAnswered: 0,
        numberOfQuestions: 16,
        theme: theme
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

    const userId = res.locals.decodedToken.id as number;

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
    await initializeQuestion(gameId, questionOrder,userId);

    // respond
    res.status(200).json({message: `Question ${questionOrder} initialized.`})
    //res.status(200).json({message: `Question ${questionOrder} initialized.`})

}) as RequestHandler)



// get 50/50 options
router.get('/help5050/:id/:questionOrder', tokenExtractor, correctUser, (async (_req: Request, res: Response) => {

    const gameId = Number(_req.params.id);
    const questionOrder = Number(_req.params.questionOrder);

    if( isNaN(gameId) || isNaN(questionOrder) ) {
        res.status(400).json({error: `GameId ${gameId} or question order ${questionOrder} is not a number.`})
        return
    }

    // get the assistant message containing the question 

    const questionConvo = await QuestionConversation.findOne({
        where: {
            role: "assistant",
            gameId: gameId,
            questionOrder: questionOrder
        }
    })

    if(!questionConvo) {
        res.status(404).json({error: `Could not find question for the gameId: ${gameId} and questionOrder: ${questionOrder}`});
        return
    }

    const correctAnswer = extractAnswer(questionConvo.content)

    if(!correctAnswer) {
        res.status(400).json({error: 'Could not extract correct answer for help 5050'})
        return
    }

    const otherOptions = ['A', 'B', 'C', 'D'].filter((element) => element !== correctAnswer);

    const selectedWrongAnswer = otherOptions[Math.floor(Math.random()) * 3]

    const orderedOptions = [correctAnswer, selectedWrongAnswer].sort()

    res.status(200).json({options: orderedOptions})


}))


router.get('/helpaudience/:id/:questionOrder', tokenExtractor, correctUser, (async ( _req: Request, res: Response) => {
    const gameId = Number(_req.params.id);
    const questionOrder = Number(_req.params.questionOrder);

    if( isNaN(gameId) || isNaN(questionOrder) ) {
        res.status(400).json({error: `GameId ${gameId} or question order ${questionOrder} is not a number.`})
        return
    }

    const questionConvo = await QuestionConversation.findOne({
        where: {
            role: "assistant",
            gameId: gameId,
            questionOrder: questionOrder
        }
    })

    if(!questionConvo) {
        res.status(404).json({error: `Could not find question for the gameId: ${gameId} and questionOrder: ${questionOrder}`});
        return
    }

    const correctAnswer = extractAnswer(questionConvo.content)

    //const otherOptions = ['A', 'B', 'C', 'D'].filter((element) => element !== correctAnswer);

    const correctAnswerProbability = 0.25 + Math.random()*0.75;

    const lowerAnswerProbability = Math.random()* (1 - correctAnswerProbability) /2;
    const secondLowerAnswerProbability = Math.random() * (1 - correctAnswerProbability - lowerAnswerProbability);
    const thirdLowerAnswerProbability = 1 - secondLowerAnswerProbability - lowerAnswerProbability - correctAnswerProbability;

    console.log([correctAnswerProbability, lowerAnswerProbability, secondLowerAnswerProbability, thirdLowerAnswerProbability])


    const audianceNumber = 347;

    const correctVotesNumber = Math.floor(audianceNumber * correctAnswerProbability);
    const lowerVotesNumbers = [
        Math.floor(lowerAnswerProbability*audianceNumber),
        Math.floor(secondLowerAnswerProbability*audianceNumber),
        Math.floor(thirdLowerAnswerProbability*audianceNumber)]


    const finalVotes = {A: 0, B: 0, C: 0, D: 0} as any;

    let index = 0
    for(const option in finalVotes) {
        if(option === correctAnswer) {
            finalVotes[option] = correctVotesNumber
        } else {
            finalVotes[option] = lowerVotesNumbers[index]
            index += 1;
        }
    }

    res.status(200).json({votes: finalVotes})

}))



router.post('/helpline/:id/:questionOrder', tokenExtractor, correctUser, (async (_req: Request, res: Response) => {

    //const userId = res.locals.decodedToken.id as number;


    const gameId = Number(_req.params.id);
    const questionOrder = Number(_req.params.questionOrder);

    if( isNaN(gameId) || isNaN(questionOrder) ) {
        res.status(400).json({error: `GameId ${gameId} or question order ${questionOrder} is not a number.`})
        return
    }

    const selectedCharacter = _req.body.selectedCharacter?.toString() as AvailableCharacters;

    if(!_req.body.selectedCharacter ) {
        res.status(400).json({error: 'No character selected'})
        return
    } else if (selectedCharacter && !( availableCharacters.includes(selectedCharacter))) {
        res.status(400).json({error: 'Selected character is not available'})
        return
    } 


    if(_req.body.playerMessage) {
        const newMessage: message = {
            role: 'user',
            content:  _req.body.playerMessage
        }

        await HelpConversation.create({
            gameId:gameId,
            questionOrder:questionOrder,
            role: newMessage.role,
            selectedCharacter: selectedCharacter,
            content: newMessage.content
        })
    }

    const previousConvo = await HelpConversation.findAll({
        where: {
            gameId: gameId,
            questionOrder: questionOrder,
            selectedCharacter: selectedCharacter
        }
    })

    const previousMessages = previousConvo.map((convoElement:HelpConversation) => {
        const message: message = {
            role: convoElement.role as roleType,
            content: convoElement.content
        }
        return message;
    })

    const chatGPTResponse = await chatGPTInterface.getNextHelpMessage(selectedCharacter,gameId,questionOrder,previousMessages);

    const newMessage : message = chatGPTResponse.choices[0].message;
    console.log(newMessage)

    await HelpConversation.create({
        gameId: gameId,
        questionOrder: questionOrder,
        role: newMessage.role,
        selectedCharacter: selectedCharacter,
        content: newMessage.content
    })

    res.status(200).json({
        role: newMessage.role,
        content: newMessage.content
    })

}))




router.post('/answer/:id/:questionOrder', tokenExtractor, correctUser, (async (_req: Request, res: Response) => {
    const answer = _req.body.answer;

    if(answer !== 'A' && answer !== 'B' && answer !== 'C' && answer !== 'D') {
        res.status(400).json({error: `Received answer ${answer} is not a valid answer A, B, C or D`})
        return
    }

    const gameId = Number(_req.params.id);
    const questionOrder = Number(_req.params.questionOrder);

    if( isNaN(gameId) || isNaN(questionOrder) ) {
        res.status(400).json({error: `GameId ${gameId} or question order ${questionOrder} is not a number.`})
        return
    }

    const gamePromise = Game.findOne({
        where: {
            id: gameId
        }
    })

    const questionPromise = QuestionConversation.findOne({
        where: {
            role: "assistant",
            gameId: gameId,
            questionOrder: questionOrder
        }
    })

    const [game, questionConvo] = await Promise.all([gamePromise, questionPromise]);

    if(!game || !questionConvo) {
        res.status(404).json({error: `Could not find game or question for the gameId: ${gameId} and questionOrder: ${questionOrder}`});
        return
    }

    const correctAnswer = extractAnswer(questionConvo.content)

    if(!correctAnswer) {
        res.status(400).json({error: `Correct answer could not be extracted from chatGPT message content: ${questionConvo.content}`});
        return
    }


    // check if already answered
    const alreadyAnswered = await GameProgress.findOne({
        where: {
            gameId: gameId,
            questionOrder: questionOrder
        }
    })

    if(alreadyAnswered) {
        res.status(400).json({error: `Question ${questionOrder} for the game ${gameId} has already been answered.`});
        return
    }

    if(answer === correctAnswer) {
        await GameProgress.create({
            gameId: gameId,
            questionOrder: questionOrder,
            correctlyAnswered: true
        })

        res.status(200).json({correctlyAnswered: true, correctAnswer: correctAnswer})
    } else {
        await GameProgress.create({
            gameId: gameId,
            questionOrder: questionOrder,
            correctlyAnswered: false
        })

        res.status(200).json({correctlyAnswered: false, correctAnswer: correctAnswer})
    }

}) as RequestHandler)



 
export async function initializeQuestion(gameId: number, questionOrder: number, userId: number) {
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
            }).then(() => {
                notifySubscriber(userId,gameId,questionOrder)
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
            }).then(() => {
                notifySubscriber(userId,gameId,questionOrder)
            })

            console.log("message ready")
            console.log(getStructuredQuestion(newMessage.content))
            
        })

}



