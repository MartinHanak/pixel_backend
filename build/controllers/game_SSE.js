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
exports.notifySubscriber = exports.router = void 0;
const express_1 = __importDefault(require("express"));
const middleware_1 = require("../util/middleware");
const middleware_2 = require("../util/middleware");
const conversation_1 = require("../models/conversation");
const questionConversation_1 = require("../models/questionConversation");
const extractStructuredQuestion_1 = require("../util/extractStructuredQuestion");
const InitializationCheck_1 = require("../models/InitializationCheck");
const game_1 = require("./game");
let subscribers = {};
exports.router = express_1.default.Router();
exports.router.get('/:id/:questionOrder', middleware_1.tokenExtractor, middleware_2.correctUser, ((_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const gameId = Number(_req.params.id);
    const questionOrder = Number(_req.params.questionOrder);
    if (isNaN(gameId) || isNaN(questionOrder)) {
        res.status(400).json({ error: `GameId ${gameId} or question order ${questionOrder} is not a number.` });
        return;
    }
    const headers = {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache'
    };
    res.writeHead(200, headers);
    const userId = res.locals.decodedToken.id;
    const sub = {
        userId: userId,
        gameId: gameId,
        questionOrder: questionOrder,
        response: res
    };
    if (userId in subscribers) {
        subscribers[userId].push(sub);
    }
    else {
        subscribers[userId] = [sub];
    }
    // if ready, respond immediately and end res
    yield notifySubscriber(userId, gameId, questionOrder);
    // check if question has been initialized, if not, do it now
    const initialCheck = yield InitializationCheck_1.InitializationCheck.findOne({ where: {
            gameId: gameId,
            questionOrder: questionOrder
        } });
    if (!initialCheck) {
        yield (0, game_1.initializeQuestion)(gameId, questionOrder, userId);
    }
    _req.on('close', () => {
        console.log(`Connection closed for user ${userId}, game: ${gameId} and question ${questionOrder}`);
        //subscribers = subscribers.filter(subscriber => subscriber.userId !== userId)
        subscribers[userId] = subscribers[userId].filter((sub) => {
            if (sub.gameId === gameId && sub.questionOrder === questionOrder) {
                return false;
            }
            else {
                return true;
            }
        });
        if (subscribers[userId].length === 0) {
            delete subscribers[userId];
        }
    });
})));
exports.router.post('/:id/:questionOrder', middleware_1.tokenExtractor, ((_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = res.locals.decodedToken.id;
    const gameId = Number(_req.params.id);
    const questionOrder = Number(_req.params.questionOrder);
    if (isNaN(gameId) || isNaN(questionOrder)) {
        res.status(400).json({ error: `GameId ${gameId} or question order ${questionOrder} is not a number.` });
        return;
    }
    yield notifySubscriber(userId, gameId, questionOrder);
    console.log(subscribers);
    res.status(200).json({ success: true });
})));
function notifySubscriber(userId, gameId, questionOrder) {
    return __awaiter(this, void 0, void 0, function* () {
        // check if user subscribed
        if (!subscribers[userId]
            || subscribers[userId].filter((sub) => {
                if (sub.gameId === gameId && sub.questionOrder === questionOrder) {
                    return true;
                }
                else {
                    return false;
                }
            }).length === 0) {
            // do nothing if not subscribed
            return;
        }
        // check if both conversation and questions are ready
        const conversationPromise = conversation_1.Conversation.findOne({
            where: {
                gameId: gameId,
                questionOrder: questionOrder,
                role: "assistant"
            }
        });
        const questionConvoPromise = questionConversation_1.QuestionConversation.findOne({
            where: {
                gameId: gameId,
                questionOrder: questionOrder,
                role: "assistant"
            }
        });
        const [convo, questionConvo] = yield Promise.all([conversationPromise, questionConvoPromise]);
        if (!convo || !questionConvo) {
            // do nothing if one of them not ready
            return;
        }
        else {
            // notify all subscriptions
            const data = {
                intro: convo.content,
                question: (0, extractStructuredQuestion_1.extractQuestion)(questionConvo.content),
                options: (0, extractStructuredQuestion_1.extractOptions)(questionConvo.content)
            };
            if (!data.question || !data.options) {
                subscribers[userId].forEach((sub) => {
                    if (sub.gameId === gameId && sub.questionOrder === questionOrder) {
                        sub.response
                            .end();
                    }
                });
                return;
            }
            subscribers[userId].forEach((sub) => {
                if (sub.gameId === gameId && sub.questionOrder === questionOrder) {
                    sub.response.write(`data: ${JSON.stringify(data)}\n\n`);
                    sub.response.end();
                }
            });
        }
    });
}
exports.notifySubscriber = notifySubscriber;
//# sourceMappingURL=game_SSE.js.map