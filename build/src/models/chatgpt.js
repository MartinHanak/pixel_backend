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
exports.chatGPTInterface = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const config_1 = require("../util/config");
const conversation_1 = require("./conversation");
const questionConversation_1 = require("./questionConversation");
const game_1 = require("./game");
const characters_1 = require("./characters");
const helpConversation_1 = require("./helpConversation");
const extractStructuredQuestion_1 = __importDefault(require("../util/extractStructuredQuestion"));
const questionStructureCheck = (chatGPTMessageContent) => {
    const strucutedResponse = (0, extractStructuredQuestion_1.default)(chatGPTMessageContent);
    if (strucutedResponse === null) {
        return false;
    }
    else {
        return true;
    }
};
class chatGPTInterfaceClass {
    getGenericResponse(messages, temperature, structureCheck) {
        return __awaiter(this, void 0, void 0, function* () {
            const headers = {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${config_1.CHATGPT_API_KEY}`
            };
            const body = {
                model: "gpt-3.5-turbo",
                messages: messages,
                temperature: temperature ? temperature : 0.75
            };
            // recurrent API call until response is ok, limit = 10
            let counter = 0;
            let makeAnotherRequest = true;
            let jsonData;
            while (makeAnotherRequest) {
                const anotherResponse = yield (0, node_fetch_1.default)(` https://api.openai.com/v1/chat/completions`, {
                    method: "POST",
                    headers: headers,
                    body: JSON.stringify(body)
                });
                console.log(`Making call number ${counter}`);
                counter += 1;
                if (counter > 3) {
                    console.log('ChatGPT used more than 3 calls for one command');
                    jsonData = {};
                    return jsonData;
                }
                if (anotherResponse.ok || counter > 3) {
                    jsonData = yield anotherResponse.json();
                    // optional structure check for the chatgpt response
                    if (!structureCheck) {
                        makeAnotherRequest = false;
                    }
                    else if (structureCheck && structureCheck(jsonData.choices[0].message.content)) {
                        makeAnotherRequest = false;
                    }
                    else {
                        makeAnotherRequest = true;
                        console.log('ChatGPT response did not have correct structure.');
                    }
                    if (!jsonData) {
                        throw new Error(`ChatGPT response JSON is empty`);
                    }
                }
            }
            return jsonData;
        });
    }
    getNextQuestion(gameId, questionOrder, messages) {
        return __awaiter(this, void 0, void 0, function* () {
            if (messages && messages.length >= 1) {
                let difficultyMessageContent;
                if (questionOrder < 5) {
                    difficultyMessageContent = "Make the question easy to answer.";
                }
                else if (questionOrder < 7) {
                    difficultyMessageContent = "Make the question moderately hard to answer.";
                }
                else if (questionOrder < 12) {
                    difficultyMessageContent = "Make the question hard to answer.";
                }
                else {
                    difficultyMessageContent = "Make the question so hard to answer that only the smartest people alive will be able to answer the question correctly.";
                }
                // append new system message
                const systemMessage = {
                    role: "system",
                    content: `Assume that the previous question was answered correctly. Ask me a new question. ${difficultyMessageContent}`
                };
                yield questionConversation_1.QuestionConversation.create({
                    gameId: gameId,
                    role: systemMessage.role,
                    content: systemMessage.content,
                    questionOrder: questionOrder
                });
                // gen next response using all previous messages
                return this.getGenericResponse([...messages, systemMessage], undefined, questionStructureCheck);
            }
            else {
                // create initial system message and append
                const systemMessage = {
                    role: "system",
                    content: "Pretend that you are a host for the Who wants to be a millionaire show. Tell me a random question in the style of Who wants to be a millionaire and give me 4 options to answer with only one of them correct. Do not ask about the same topic twice. Make the question hard to answer. Structure your response so that there is always Question and : before the question and structure the 4 answers as a list indexed by the letters A, B, C, D. Structure your response so that there is always Answer and : before the correct answer. Make sure that the answer is exactly equal to the correct option. Always include the answer in your response."
                };
                const sentMessages = [systemMessage];
                const game = yield game_1.Game.findOne({
                    where: {
                        id: gameId
                    }
                });
                if (game && game.theme && game.theme !== '') {
                    const theme = game.theme;
                    const optionalSystemMessage = {
                        role: "system",
                        content: `Center all your question about the following topic: ${theme}.`
                    };
                    sentMessages.push(optionalSystemMessage);
                }
                // save used messages
                yield questionConversation_1.QuestionConversation.bulkCreate(sentMessages.map((msg) => {
                    return {
                        gameId: gameId,
                        role: msg.role,
                        content: msg.content,
                        questionOrder: questionOrder
                    };
                }));
                // get first response
                return this.getGenericResponse(sentMessages);
            }
        });
    }
    getNextIntroduction(gameId, questionOrder, messages) {
        return __awaiter(this, void 0, void 0, function* () {
            if (messages && messages.length >= 1) {
                const systemMessage = {
                    role: "system",
                    content: "Tell me an introduction for the next question. Try to be funny and irritating at the same time. Assume that the previous question was answered correctly.  Make the introduction for the next question short with only one sentence in length."
                };
                yield conversation_1.Conversation.create({
                    gameId: gameId,
                    role: systemMessage.role,
                    content: systemMessage.content,
                    questionOrder: questionOrder
                });
                return this.getGenericResponse([...messages, systemMessage]);
            }
            else {
                // generate first introduction
                const systemMessage = {
                    role: "system",
                    content: "Pretend that you are a host for the Who wants to be a millionaire show. Tell me something before the next question. Try to be funny and irritating at the same time. Do not mention the question order. Make your introduction short."
                };
                yield conversation_1.Conversation.bulkCreate([{
                        gameId: gameId,
                        role: systemMessage.role,
                        content: systemMessage.content,
                        questionOrder: questionOrder
                    }]);
                return this.getGenericResponse([systemMessage]);
            }
        });
    }
    getNextHelpMessage(character, gameId, questionOrder, messages) {
        return __awaiter(this, void 0, void 0, function* () {
            if (messages && messages.length >= 1) {
                return this.getGenericResponse(messages);
            }
            else {
                // generate first message
                const systemMessage = {
                    role: "system",
                    content: characters_1.characterFirstSystemMessage[character]
                };
                yield helpConversation_1.HelpConversation.create({
                    gameId: gameId,
                    role: systemMessage.role,
                    content: systemMessage.content,
                    selectedCharacter: character,
                    questionOrder: questionOrder
                });
                return this.getGenericResponse([systemMessage]);
            }
        });
    }
}
exports.chatGPTInterface = new chatGPTInterfaceClass();
//# sourceMappingURL=chatgpt.js.map