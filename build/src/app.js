"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
require('express-async-errors');
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const users_1 = require("./controllers/users");
const login_1 = require("./controllers/login");
const chatgpt_1 = require("./controllers/chatgpt");
const game_1 = require("./controllers/game");
const game_SSE_1 = require("./controllers/game_SSE");
const middleware_1 = require("./util/middleware");
const app = (0, express_1.default)();
exports.default = app;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/api/users', users_1.router);
app.use('/api/login', login_1.router);
app.use('/api/chatgpt', chatgpt_1.router);
app.use('/api/game', game_1.router);
app.use('/api/gameSSE', game_SSE_1.router);
app.use(middleware_1.errorHandler);
app.get('/', ((_req, res) => {
    res.status(200).send({ message: `Hello world!` });
}));
//# sourceMappingURL=app.js.map