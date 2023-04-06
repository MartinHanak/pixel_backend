import fetch from 'node-fetch';
import { CHATGPT_API_KEY } from '../util/config';

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

    async getGenericResponse(messages: messages, temperature? : number) {
        const headers = {
            "Content-Type": "application/json",
            "Authorization" : `Bearer ${CHATGPT_API_KEY}`
        }

        const body : chatGPTRequestBody = {
            model : "gpt-3.5-turbo",
            messages: messages,
            temperature : temperature? temperature : 1.0
        }

        const response = await fetch(` https://api.openai.com/v1/chat/completions`, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(body)
        })

        const jsonResponse = await response.json();

        return jsonResponse;
    }

    async getNextQuestion(messages?: messages) {

        const systemMessage : message = {role: "system",
        content: "Pretend that you are a host for the Who wants to be a millionaire show. Tell me a random question in the style of Who wants to be a millionaire and give me 4 options to answer with only one of them correct. Do not ask about the same topic twice. Make the question hard to answer. Structure your response so that there is always Question and : before the question and structure the 4 answers as a list. Structure your response so that there is always Answer and : before the correct answer. Make sure that the answer is exactly equal to the correct option."}

        if(messages && messages.length > 1) {
            return this.getGenericResponse(messages,0.5);
        } else {
            return this.getGenericResponse([systemMessage],0.5);
        }
    }

    async getFirstIntroduction(messages? : messages) {
        const systemMessage : message = {
            role: "system",
            content: "Pretend that you are a host for the Who wants to be a millionaire show. Tell me something before the next question. Try to be funny and irritating at the same time."
        }
        const systemStructure : message = {
            role: "system",
            content : "Also give me 4 options on how to react to your introduction before answering the question. Structure the options so that there is always O and : before the option and  show it as a list. Make the first option sarcastic, second option generally positive, third option negative and make the fourth option sound like a Karen."
        }


        if(messages && messages.length > 1) {
            return this.getGenericResponse(messages)
        } else {
            return this.getGenericResponse([systemMessage, systemStructure]);
        }
    }

    async getNextIntroduction(messages? : messages) {
        const systemMessage : message = {
            role: "system",
            content: "Pretend that you are a host for the Who wants to be a millionaire show. Tell me an introduction for the next question. Try to be funny and irritating at the same time. Assume that the previous question was answered correctly.  Make the introduction for the next question short."
        }

        


        if(messages && messages.length > 1) {
            return this.getGenericResponse(messages, 1)
        } else {
            return this.getGenericResponse([systemMessage], 1);
        }
    }

}


export const chatGPTInterface = new chatGPTInterfaceClass();
