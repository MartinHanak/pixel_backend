import {sequelize, connectToDatabase} from '../src/util/db';
import { chatGPTInterface, messages } from '../src/models/chatgpt';

//const api = supertest(app);

beforeAll(async () => {
    //await sequelize.authenticate()
    //await sequelize.sync({force: true})
    await connectToDatabase();
})

test('chatGPT provides correct generic response', async () => {

    const messages: messages = [
        {role: "system", content: "Tell me a joke" }
    ]

    const response = await chatGPTInterface.getGenericResponse(messages, 0.8);

    console.log(response.choices[0].message.content);
    expect(response.choices[0].message.role).toEqual("assistant")
    expect(response.choices[0].message.content).not.toBeNull()
    
}, 100000 )

afterAll (async () => {
    await sequelize.close();
})