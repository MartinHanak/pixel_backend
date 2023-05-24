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
test('users are returned as json', () => __awaiter(void 0, void 0, void 0, function* () {
    yield api
        .get('/api/users')
        .expect(200)
        .expect('Content-Type', /application\/json/);
}), 100000);
test('get user by id', () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield api.get('/api/users/1');
    expect(response.status).toEqual(200);
    expect(response.body.username).toEqual('Martin');
}), 100000);
test('new user has to have a unique name', () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield api.post('/api/users').send({ username: 'Martin', password: '1234' });
    expect(response.status).toEqual(400);
}), 100000);
test('creating a new user requires username and password', () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield api.post('/api/users').send({ username: 'sth' });
    expect(response.status).toEqual(400);
}), 100000);
test('creating a new user with correct input works', () => __awaiter(void 0, void 0, void 0, function* () {
    const currentDate = Date.now();
    const newUsername = `Martin_${currentDate}`;
    const response = yield api.post('/api/users').send({ username: newUsername, password: '1234' });
    expect(response.status).toEqual(201);
    expect(response.body.username).toEqual(newUsername);
    expect(response.body.token).not.toBeNull();
}), 100000);
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield db_1.sequelize.close();
}));
//# sourceMappingURL=user_api.test.js.map