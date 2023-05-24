"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeQuestion = exports.router = void 0;
const express_1 = __importDefault(require("express"));
const middleware_1 = require("../util/middleware");
const game_1 = require("../models/game");
const conversation_1 = require("../models/conversation");
const questionConversation_1 = require("../models/questionConversation");
const InitializationCheck_1 = require("../models/InitializationCheck");
const chatgpt_1 = require("../models/chatgpt");
const extractStructuredQuestion_1 = require("../util/extractStructuredQuestion");
const gameProgress_1 = require("../models/gameProgress");
const game_SSE_1 = require("./game_SSE");
const extractStructuredQuestion_2 = __importDefault(require("../util/extractStructuredQuestion"));
const characters_1 = require("../models/characters");
const helpConversation_1 = require("../models/helpConversation");
exports.router = express_1.default.Router();
// get all games
exports.router.get('/', middleware_1.tokenExtractor, ((_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // get id and username from extracted token
    const userId = res.locals.decodedToken.id;
    const games = yield game_1.Game.findAll({
        where: { userId: userId },
        order: [['createdAt', 'DESC']]
    });
    if (games) {
        res.status(200).json({ games });
    }
    else {
        res.status(404).json({ error: "No game found for given user." });
    }
})));
// get newest game
exports.router.get('/last', middleware_1.tokenExtractor, ((_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // get id and username from extracted token
    const userId = res.locals.decodedToken.id;
    const lastGame = yield game_1.Game.findOne({
        where: { userId: userId },
        order: [['createdAt', 'DESC']]
    });
    if (!lastGame) {
        res.status(404).json({ error: "No game found for given user." });
        return;
    }
    let lastQuestionOrder = null;
    // find last questionOrder unanswered for the given game
    const gameProgress = yield gameProgress_1.GameProgress.findOne({
        where: {
            gameId: lastGame.id
        },
        order: [['createdAt', 'DESC']]
    });
    if (!gameProgress) {
        // no question answered yet
        lastQuestionOrder = 1;
    }
    else {
        // db has info about last answered question
        lastQuestionOrder = gameProgress.questionOrder + 1;
    }
    // check if it is not higher than max questions OR game over already
    if (lastGame.gameOver) {
        res.status(400).json({ error: `Game ${lastGame.id} has already finished.` });
        return;
    }
    else if (lastQuestionOrder > lastGame.numberOfQuestions) {
        res.status(400).json({ error: `Game ${lastGame.id} has already successfully finished.` });
        return;
    }
    res.status(200).json({
        gameId: lastGame.id,
        questionOrder: lastQuestionOrder,
        numberOfQuestions: lastGame.numberOfQuestions,
        usedAudience: lastGame.usedAudience,
        used5050: lastGame.used5050,
        usedHelpline: lastGame.usedHelpline
    });
})));
// get oldest questionOrder for specified id
exports.router.get('/:id/last', middleware_1.tokenExtractor, ((_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const gameId = Number(_req.params.id);
    let lastQuestionOrder = 0;
    const game = yield game_1.Game.findOne({
        where: {
            id: gameId
        }
    });
    if (!game) {
        res.status(404).json({ error: `Game ${gameId} not found` });
        return;
    }
    // find last questionOrder unanswered for the given game
    const gameProgress = yield gameProgress_1.GameProgress.findOne({
        where: {
            gameId: game.id
        },
        order: [['createdAt', 'DESC']]
    });
    if (!gameProgress) {
        // no question answered yet
        lastQuestionOrder = 1;
    }
    else {
        // db has info about last answered question
        lastQuestionOrder = gameProgress.questionOrder + 1;
    }
    // check if it is not higher than max questions OR game over already
    if (game.gameOver) {
        res.status(400).json({ error: `Game ${game.id} has already finished.` });
        return;
    }
    else if (lastQuestionOrder > game.numberOfQuestions) {
        res.status(400).json({ error: `Game ${game.id} has already successfully finished.` });
        return;
    }
    res.status(200).json({
        gameId: game.id,
        questionOrder: lastQuestionOrder,
        numberOfQuestions: game.numberOfQuestions,
        usedAudience: game.usedAudience,
        used5050: game.used5050,
        usedHelpline: game.usedHelpline
    });
})));
// create game
exports.router.post('/', middleware_1.tokenExtractor, ((_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // get id and username from extracted token
    const userId = res.locals.decodedToken.id;
    console.log(userId);
    let theme = null;
    if (_req.body.theme && _req.body.theme !== '') {
        theme = _req.body.theme;
    }
    // always create a new game
    const game = yield game_1.Game.create({
        userId: userId,
        correctlyAnswered: 0,
        numberOfQuestions: 15,
        theme: theme
    });
    res.status(200).json({ gameId: game.id });
})));
// get all info for given game id
exports.router.get('/:id', middleware_1.tokenExtractor, ((_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // get id and username from extracted token
    const userId = res.locals.decodedToken.id;
    const gameId = _req.params.id;
    const game = game_1.Game.findOne({
        where: { id: gameId }
    });
    const conversation = conversation_1.Conversation.findAll({
        where: { gameId: gameId }
    });
    const questionConversation = questionConversation_1.QuestionConversation.findAll({
        where: { gameId: gameId }
    });
    const combinedPromise = yield Promise.all([game, conversation, questionConversation]);
    if (combinedPromise[0] && combinedPromise[1] && combinedPromise[2]) {
        if (combinedPromise[0].userId === userId) {
            res.status(200).json({
                game: combinedPromise[0],
                conversation: combinedPromise[1],
                questionConversation: combinedPromise[2]
            });
            return;
        }
        else {
            res.status(401).json({ error: "User is not authorized to view this game." });
            return;
        }
    }
    else {
        res.status(400).json({ error: `Could not retrieve info about game ${gameId}.` });
        return;
    }
})));
// get only conversation and questionConversation for the specific question order
exports.router.get('/:id/:questionOrder', middleware_1.tokenExtractor, ((_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const gameId = _req.params.id;
    const questionOrder = _req.params.questionOrder;
    // get id and username from extracted token
    const userId = res.locals.decodedToken.id;
    const game = game_1.Game.findOne({
        where: { id: gameId }
    });
    const conversation = conversation_1.Conversation.findAll({
        where: { gameId: gameId, questionOrder: questionOrder }
    });
    const questionConversation = questionConversation_1.QuestionConversation.findAll({
        where: { gameId: gameId, questionOrder: questionOrder }
    });
    const combinedPromise = yield Promise.all([game, conversation, questionConversation]);
    if (combinedPromise[0] && combinedPromise[1] && combinedPromise[2]) {
        if (combinedPromise[0].userId === userId) {
            res.status(200).json({
                game: combinedPromise[0],
                conversation: combinedPromise[1],
                questionConversation: combinedPromise[2]
            });
            return;
        }
        else {
            res.status(401).json({ error: "User is not authorized to view this game." });
            return;
        }
    }
    else {
        res.status(400).json({ error: `Could not retrieve info about game ${gameId} and question order ${questionOrder}.` });
        return;
    }
})));
// if post request for specific game id and question order, initilze chatGPT generation if not already done
exports.router.post('/:id/:questionOrder', middleware_1.tokenExtractor, ((_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = res.locals.decodedToken.id;
    // check if already initialized and correct user
    const gameId = Number(_req.params.id);
    const questionOrder = Number(_req.params.questionOrder);
    if (isNaN(gameId) || isNaN(questionOrder)) {
        res.status(400).json({ error: `GameId ${gameId} or question order ${questionOrder} is not a number.` });
        return;
    }
    const game = yield game_1.Game.findOne({ where: { id: gameId } });
    if (!game) {
        res.status(404).json({ error: `Could not find game with id ${gameId}` });
        return;
    }
    const initializedCheck = yield InitializationCheck_1.InitializationCheck.findOne({
        where: {
            gameId: gameId,
            questionOrder: questionOrder
        }
    });
    if (initializedCheck && initializedCheck.initialized) {
        res.status(200).json({ message: `Question with order ${questionOrder} for the game with id ${gameId} was already initialized.` });
        return;
    }
    // if not initialized, initialize now
    yield initializeQuestion(gameId, questionOrder, userId);
    // respond
    res.status(200).json({ message: `Question ${questionOrder} initialized.` });
    //res.status(200).json({message: `Question ${questionOrder} initialized.`})
})));
// get 50/50 options
exports.router.get('/help5050/:id/:questionOrder', middleware_1.tokenExtractor, middleware_1.correctUser, ((_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const gameId = Number(_req.params.id);
    const questionOrder = Number(_req.params.questionOrder);
    if (isNaN(gameId) || isNaN(questionOrder)) {
        res.status(400).json({ error: `GameId ${gameId} or question order ${questionOrder} is not a number.` });
        return;
    }
    // get the assistant message containing the question 
    const questionConvo = yield questionConversation_1.QuestionConversation.findOne({
        where: {
            role: "assistant",
            gameId: gameId,
            questionOrder: questionOrder
        }
    });
    if (!questionConvo) {
        res.status(404).json({ error: `Could not find question for the gameId: ${gameId} and questionOrder: ${questionOrder}` });
        return;
    }
    const correctAnswer = (0, extractStructuredQuestion_1.extractAnswer)(questionConvo.content);
    if (!correctAnswer) {
        res.status(400).json({ error: 'Could not extract correct answer for help 5050' });
        return;
    }
    const otherOptions = ['A', 'B', 'C', 'D'].filter((element) => element !== correctAnswer);
    const selectedWrongAnswer = otherOptions[Math.floor(Math.random()) * 3];
    const orderedOptions = [correctAnswer, selectedWrongAnswer].sort();
    // update db
    yield game_1.Game.update({ used5050: true }, { where: { id: gameId } });
    res.status(200).json({ options: orderedOptions });
})));
exports.router.get('/helpaudience/:id/:questionOrder', middleware_1.tokenExtractor, middleware_1.correctUser, ((_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const gameId = Number(_req.params.id);
    const questionOrder = Number(_req.params.questionOrder);
    if (isNaN(gameId) || isNaN(questionOrder)) {
        res.status(400).json({ error: `GameId ${gameId} or question order ${questionOrder} is not a number.` });
        return;
    }
    const questionConvo = yield questionConversation_1.QuestionConversation.findOne({
        where: {
            role: "assistant",
            gameId: gameId,
            questionOrder: questionOrder
        }
    });
    if (!questionConvo) {
        res.status(404).json({ error: `Could not find question for the gameId: ${gameId} and questionOrder: ${questionOrder}` });
        return;
    }
    const correctAnswer = (0, extractStructuredQuestion_1.extractAnswer)(questionConvo.content);
    //const otherOptions = ['A', 'B', 'C', 'D'].filter((element) => element !== correctAnswer);
    const correctAnswerProbability = 0.25 + Math.random() * 0.75;
    const lowerAnswerProbability = Math.random() * (1 - correctAnswerProbability) / 2;
    const secondLowerAnswerProbability = Math.random() * (1 - correctAnswerProbability - lowerAnswerProbability);
    const thirdLowerAnswerProbability = 1 - secondLowerAnswerProbability - lowerAnswerProbability - correctAnswerProbability;
    console.log([correctAnswerProbability, lowerAnswerProbability, secondLowerAnswerProbability, thirdLowerAnswerProbability]);
    const audianceNumber = 347;
    const correctVotesNumber = Math.floor(audianceNumber * correctAnswerProbability);
    const lowerVotesNumbers = [
        Math.floor(lowerAnswerProbability * audianceNumber),
        Math.floor(secondLowerAnswerProbability * audianceNumber),
        Math.floor(thirdLowerAnswerProbability * audianceNumber)
    ];
    const finalVotes = { A: 0, B: 0, C: 0, D: 0 };
    let index = 0;
    for (const option in finalVotes) {
        if (option === correctAnswer) {
            finalVotes[option] = correctVotesNumber;
        }
        else {
            finalVotes[option] = lowerVotesNumbers[index];
            index += 1;
        }
    }
    yield game_1.Game.update({ usedAudience: true }, { where: { id: gameId } });
    res.status(200).json({ votes: finalVotes });
})));
exports.router.post('/helpline/:id/:questionOrder', middleware_1.tokenExtractor, middleware_1.correctUser, ((_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //const userId = res.locals.decodedToken.id as number;
    var _a;
    const gameId = Number(_req.params.id);
    const questionOrder = Number(_req.params.questionOrder);
    if (isNaN(gameId) || isNaN(questionOrder)) {
        res.status(400).json({ error: `GameId ${gameId} or question order ${questionOrder} is not a number.` });
        return;
    }
    const selectedCharacter = (_a = _req.body.selectedCharacter) === null || _a === void 0 ? void 0 : _a.toString();
    if (!_req.body.selectedCharacter) {
        res.status(400).json({ error: 'No character selected' });
        return;
    }
    else if (selectedCharacter && !(characters_1.availableCharacters.includes(selectedCharacter))) {
        res.status(400).json({ error: 'Selected character is not available' });
        return;
    }
    if (_req.body.playerMessage) {
        const newMessage = {
            role: 'user',
            content: _req.body.playerMessage
        };
        yield helpConversation_1.HelpConversation.create({
            gameId: gameId,
            questionOrder: questionOrder,
            role: newMessage.role,
            selectedCharacter: selectedCharacter,
            content: newMessage.content
        });
    }
    const previousConvo = yield helpConversation_1.HelpConversation.findAll({
        where: {
            gameId: gameId,
            questionOrder: questionOrder,
            selectedCharacter: selectedCharacter
        }
    });
    const previousMessages = previousConvo.map((convoElement) => {
        const message = {
            role: convoElement.role,
            content: convoElement.content
        };
        return message;
    });
    const chatGPTResponse = yield chatgpt_1.chatGPTInterface.getNextHelpMessage(selectedCharacter, gameId, questionOrder, previousMessages);
    const newMessage = chatGPTResponse.choices[0].message;
    console.log(newMessage);
    yield helpConversation_1.HelpConversation.create({
        gameId: gameId,
        questionOrder: questionOrder,
        role: newMessage.role,
        selectedCharacter: selectedCharacter,
        content: newMessage.content
    });
    yield game_1.Game.update({ usedHelpline: true }, { where: { id: gameId } });
    res.status(200).json({
        role: newMessage.role,
        content: newMessage.content
    });
})));
exports.router.post('/answer/:id/:questionOrder', middleware_1.tokenExtractor, middleware_1.correctUser, ((_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const answer = _req.body.answer;
    if (answer !== 'A' && answer !== 'B' && answer !== 'C' && answer !== 'D') {
        res.status(400).json({ error: `Received answer ${answer} is not a valid answer A, B, C or D` });
        return;
    }
    const gameId = Number(_req.params.id);
    const questionOrder = Number(_req.params.questionOrder);
    if (isNaN(gameId) || isNaN(questionOrder)) {
        res.status(400).json({ error: `GameId ${gameId} or question order ${questionOrder} is not a number.` });
        return;
    }
    const gamePromise = game_1.Game.findOne({
        where: {
            id: gameId
        }
    });
    const questionPromise = questionConversation_1.QuestionConversation.findOne({
        where: {
            role: "assistant",
            gameId: gameId,
            questionOrder: questionOrder
        }
    });
    const [game, questionConvo] = yield Promise.all([gamePromise, questionPromise]);
    if (!game || !questionConvo) {
        res.status(404).json({ error: `Could not find game or question for the gameId: ${gameId} and questionOrder: ${questionOrder}` });
        return;
    }
    const correctAnswer = (0, extractStructuredQuestion_1.extractAnswer)(questionConvo.content);
    if (!correctAnswer) {
        res.status(400).json({ error: `Correct answer could not be extracted from chatGPT message content: ${questionConvo.content}` });
        return;
    }
    // check if already answered
    const alreadyAnswered = yield gameProgress_1.GameProgress.findOne({
        where: {
            gameId: gameId,
            questionOrder: questionOrder
        }
    });
    if (alreadyAnswered) {
        res.status(400).json({ error: `Question ${questionOrder} for the game ${gameId} has already been answered.` });
        return;
    }
    if (answer === correctAnswer) {
        yield gameProgress_1.GameProgress.create({
            gameId: gameId,
            questionOrder: questionOrder,
            correctlyAnswered: true
        });
        res.status(200).json({ correctlyAnswered: true, correctAnswer: correctAnswer });
    }
    else {
        yield gameProgress_1.GameProgress.create({
            gameId: gameId,
            questionOrder: questionOrder,
            correctlyAnswered: false
        });
        res.status(200).json({ correctlyAnswered: false, correctAnswer: correctAnswer });
    }
})));
function initializeQuestion(gameId, questionOrder, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        yield InitializationCheck_1.InitializationCheck.create({
            gameId: gameId,
            questionOrder: questionOrder,
            initialized: true
        });
        // create new
        // get previous conversation
        const convoPromise = conversation_1.Conversation.findAll({
            where: {
                gameId: gameId
            }
        });
        const questionPromise = questionConversation_1.QuestionConversation.findAll({
            where: {
                gameId: gameId
            }
        });
        const [previousConversation, previousQuestions] = yield Promise.all([convoPromise, questionPromise]);
        // request new one
        const previousConvoMessages = previousConversation.map((convoElement) => {
            const message = {
                role: convoElement.role,
                content: convoElement.content
            };
            return message;
        });
        const previousQuestionMessages = previousQuestions.map((questionElement) => {
            const message = {
                role: questionElement.role,
                content: questionElement.content
            };
            return message;
        });
        const newConversationMessage = chatgpt_1.chatGPTInterface.getNextIntroduction(gameId, questionOrder, previousConvoMessages);
        const newQuestionMessage = chatgpt_1.chatGPTInterface.getNextQuestion(gameId, questionOrder, previousQuestionMessages);
        // queue processing of the chatGPT response before responding, but do not await
        newConversationMessage.then((chatGPTResponse) => {
            if (!chatGPTResponse.choices[0].message) {
                throw new Error('No message in chatGPT response');
            }
            const newMessage = chatGPTResponse.choices[0].message;
            conversation_1.Conversation.create({
                gameId: gameId,
                role: newMessage.role,
                content: newMessage.content,
                questionOrder: questionOrder
            }).then(() => {
                (0, game_SSE_1.notifySubscriber)(userId, gameId, questionOrder);
            });
            console.log("message ready");
            console.log(newMessage);
        }).catch(() => {
            console.log('Failed to get chatGPT new conversation message.');
        });
        newQuestionMessage.then((chatGPTResponse) => {
            if (!chatGPTResponse.choices[0].message) {
                throw new Error('No message in chatGPT response');
            }
            const newMessage = chatGPTResponse.choices[0].message;
            // check if correct structure
            if ((0, extractStructuredQuestion_2.default)(newMessage.content) === null) {
                console.log('Could not extract question from the chatGPT response during initializeQuestion.');
            }
            questionConversation_1.QuestionConversation.create({
                gameId: gameId,
                role: newMessage.role,
                content: newMessage.content,
                questionOrder: questionOrder
            }).then(() => {
                (0, game_SSE_1.notifySubscriber)(userId, gameId, questionOrder);
            });
            console.log("message ready");
            console.log((0, extractStructuredQuestion_2.default)(newMessage.content));
        }).catch(() => {
            console.log('Failed to get chatGPT new question message.');
        });
    });
}
exports.initializeQuestion = initializeQuestion;
//# sourceMappingURL=game.js.map