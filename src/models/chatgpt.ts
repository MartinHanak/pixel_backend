import fetch from 'node-fetch';
import { CHATGPT_API_KEY } from '../util/config';
import { Conversation } from './conversation';
import { QuestionConversation } from './questionConversation';
import { Game } from './game';

import { AvailableCharacters, characterFirstSystemMessage } from "./characters"
import { HelpConversation } from './helpConversation';
import getStructuredQuestion from '../util/extractStructuredQuestion';

const questionStructureCheck = (chatGPTMessageContent: string) => {
    const strucutedResponse = getStructuredQuestion(chatGPTMessageContent);
    if(strucutedResponse === null) {
        return false
    } else {
        return true
    }
}


export type message = {
    role : "system" | "user" | "assistant",
    content: string
}
export type messages = message[];

export interface chatGPTRequestBody {
    model: "gpt-3.5-turbo",
    messages: messages,
    temperature: number
}


class chatGPTInterfaceClass  {

    async getGenericResponse(messages: messages, temperature? : number, structureCheck?: (chatGPTMessageContent: string) => boolean) {
        const headers = {
            "Content-Type": "application/json",
            "Authorization" : `Bearer ${CHATGPT_API_KEY}`
        }

        const body : chatGPTRequestBody = {
            model : "gpt-3.5-turbo",
            messages: messages,
            temperature : temperature? temperature : 0.75
        }

        // recurrent API call until response is ok, limit = 10
        let counter = 0;
        let makeAnotherRequest = true;
        let jsonData;

        while(makeAnotherRequest) {

            const anotherResponse = await fetch(` https://api.openai.com/v1/chat/completions`, {
                method: "POST",
                headers: headers,
                body: JSON.stringify(body)
            })

            console.log(`Making call number ${counter}`)
            counter += 1;

            if(counter > 3) {
                console.log('ChatGPT used more than 3 calls for one command')
                jsonData = {}
                return jsonData;
            }


            if(anotherResponse.ok || counter > 3) {
                
                jsonData = await anotherResponse.json()

                // optional structure check for the chatgpt response
                if(!structureCheck) {
                    makeAnotherRequest = false;
                } else if(structureCheck && structureCheck(jsonData.choices[0].message.content)) {
                    makeAnotherRequest = false;
                } else {
                    makeAnotherRequest = true;
                    console.log('ChatGPT response did not have correct structure.')
                }

                if(!jsonData) {
                    throw new Error(`ChatGPT response JSON is empty`);
                }
            } 
        }

        return jsonData;
    }

    async getNextQuestion(gameId: number, questionOrder: number, messages?: messages) {

        if(messages && messages.length >= 1) {

            let difficultyMessageContent: string;
            if(questionOrder < 5) {
                difficultyMessageContent = "Make the question easy to answer."
            } else if (questionOrder < 7) {
                difficultyMessageContent = "Make the question moderately hard to answer."
            } else if (questionOrder < 12) {
                difficultyMessageContent = "Make the question hard to answer."
            } else {
                difficultyMessageContent = "Make the question so hard to answer that only the smartest people alive will be able to answer the question correctly."
            }

            // append new system message
            const systemMessage : message = {
                role: "system",
                content: `Assume that the previous question was answered correctly. Ask me a new question. ${difficultyMessageContent}`
            }

            await QuestionConversation.create({
                gameId: gameId,
                role: systemMessage.role,
                content: systemMessage.content,
                questionOrder: questionOrder
            })

            // gen next response using all previous messages
            return this.getGenericResponse([...messages,systemMessage],undefined,questionStructureCheck);
        } else {
            // create initial system message and append
            const systemMessage : message = {
                role: "system",
                content: "Pretend that you are a host for the Who wants to be a millionaire show. Tell me a random question in the style of Who wants to be a millionaire and give me 4 options to answer with only one of them correct. Do not ask about the same topic twice. Make the question hard to answer. Structure your response so that there is always Question and : before the question and structure the 4 answers as a list indexed by the letters A, B, C, D. Structure your response so that there is always Answer and : before the correct answer. Make sure that the answer is exactly equal to the correct option. Always include the answer in your response."
            }

            const sentMessages : messages = [ systemMessage ]

            const game = await Game.findOne({
                where: {
                    id: gameId
                }
            })

            if (game && game.theme && game.theme !== '') {
                const theme = game.theme;

                const optionalSystemMessage : message = {
                    role: "system",
                    content: `Center all your question about the following topic: ${theme}.`
                }

                sentMessages.push(optionalSystemMessage);

            }

            // save used messages
            await QuestionConversation.bulkCreate(
                sentMessages.map((msg: message) => {
                    return {
                        gameId: gameId,
                        role: msg.role,
                        content: msg.content,
                        questionOrder: questionOrder
                    }
                })
            )

            // get first response
            return this.getGenericResponse(sentMessages);
        }
    }


    async getNextIntroduction(gameId: number, questionOrder: number, messages? : messages) {

        if(messages && messages.length >= 1) {
            const systemMessage : message = {
                role: "system",
                content: "Tell me an introduction for the next question. Try to be funny and irritating at the same time. Assume that the previous question was answered correctly.  Make the introduction for the next question short with only one sentence in length."
            }

            await Conversation.create({
                gameId: gameId,
                role: systemMessage.role,
                content: systemMessage.content,
                questionOrder: questionOrder
            })

            return this.getGenericResponse([...messages, systemMessage])

        } else {
            // generate first introduction
            const systemMessage : message = {
                role: "system",
                content: "Pretend that you are a host for the Who wants to be a millionaire show. Tell me something before the next question. Try to be funny and irritating at the same time. Do not mention the question order. Make your introduction short."
            }


            await Conversation.bulkCreate([{
                gameId: gameId,
                role: systemMessage.role,
                content: systemMessage.content,
                questionOrder: questionOrder
            }])

            return this.getGenericResponse([systemMessage]);
        }
    }

    async getNextHelpMessage(character: AvailableCharacters, gameId: number, questionOrder: number, messages? : messages) {
        if(messages && messages.length >= 1) {
            return this.getGenericResponse(messages)
        } else {
            // generate first message
            const systemMessage: message = {
                role: "system",
                content:  characterFirstSystemMessage[character]
            }

            await HelpConversation.create({
                gameId: gameId,
                role: systemMessage.role,
                content: systemMessage.content,
                selectedCharacter: character,
                questionOrder: questionOrder
            })

            return this.getGenericResponse([systemMessage]);
        
        }
    }

}


export const chatGPTInterface = new chatGPTInterfaceClass();
