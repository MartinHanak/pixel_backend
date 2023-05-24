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
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../src/app"));
const db_1 = require("../src/util/db");
const api = (0, supertest_1.default)(app_1.default);
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    //await sequelize.authenticate()
    //await sequelize.sync({force: true})
    yield (0, db_1.connectToDatabase)();
}));
test('get last game id for logged in user is successful', () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield api.get('/api/game').set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ik1hcnRpbiIsImlkIjoxLCJpYXQiOjE2ODA3OTE1Njd9.lZPV0hRSY6Pvpl8R8_LfpWCNOR0W3JbSss-fsjd93s8");
    expect(response.status).toEqual(200);
    //expect(response.body.gameId).not.toBeNull();
}), 100000);
test('creating a new game for logged-in user is possible', () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield api.post('/api/game').set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ik1hcnRpbiIsImlkIjoxLCJpYXQiOjE2ODA3OTE1Njd9.lZPV0hRSY6Pvpl8R8_LfpWCNOR0W3JbSss-fsjd93s8");
    expect(response.status).toEqual(200);
    expect(response.body.gameId).not.toBeNull();
}), 100000);
test('getting last game info is possible', () => __awaiter(void 0, void 0, void 0, function* () {
    // login
    const responseLogin = yield api.post('/api/login').send({ username: 'Martin', password: '1234' });
    expect(responseLogin.status).toEqual(200);
    expect(responseLogin.body.token).not.toBeNull();
    //const username = responseLogin.body.username;
    const token = responseLogin.body.token;
    // get id
    const responseForId = yield api.get('/api/game').set("Authorization", `Bearer ${token}`);
    expect(responseForId.status).toEqual(200);
    //const gameId = responseForId.body.gameId;
    //const response = await api.get(`/api/game/${gameId}`).set("Authorization", `Bearer ${token}`);
    //expect(response.status).toEqual(200);
}), 100000);
/*
test('generating a new question', async () => {
    // login
    const responseLogin = await api.post('/api/login').send({username: 'Martin', password: '1234'})
    expect(responseLogin.status).toEqual(200);
    expect(responseLogin.body.token).not.toBeNull();

    //const username = responseLogin.body.username;
    const token = responseLogin.body.token;

    // get id
    const responseForId = await api.get('/api/game').set("Authorization", `Bearer ${token}`)
    expect(responseForId.status).toEqual(200);
    const gameId = responseForId.body.gameId;


    const response = await api.post(`/api/game/${gameId}/1`).set("Authorization", `Bearer ${token}`)

    expect(response.status).toEqual(200);
}, 100000);
*/
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield db_1.sequelize.close();
}));
//# sourceMappingURL=game_api.test.js.map