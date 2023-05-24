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
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../src/util/db");
const chatgpt_1 = require("../src/models/chatgpt");
//const api = supertest(app);
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    //await sequelize.authenticate()
    //await sequelize.sync({force: true})
    yield (0, db_1.connectToDatabase)();
}));
test('chatGPT provides correct generic response', () => __awaiter(void 0, void 0, void 0, function* () {
    const messages = [
        { role: "system", content: "Tell me a joke" }
    ];
    const response = yield chatgpt_1.chatGPTInterface.getGenericResponse(messages, 0.8);
    console.log(response.choices[0].message.content);
    expect(response.choices[0].message.role).toEqual("assistant");
    expect(response.choices[0].message.content).not.toBeNull();
}), 100000);
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield db_1.sequelize.close();
}));
//# sourceMappingURL=chatgpt_model.test.js.map