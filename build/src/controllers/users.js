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
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const user_1 = require("../models/user");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../util/config");
exports.router = express_1.default.Router();
// get all users
exports.router.get('/', ((_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_1.User.findAll();
    res.json(users);
})));
const isValidUserInput = (input) => {
    if (input.username && input.password) {
        return true;
    }
    else {
        return false;
    }
};
// get one user
exports.router.get('/:id', ((_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_1.User.findByPk(_req.params.id);
    if (user) {
        res.json(user);
    }
    else {
        res.status(404).end();
    }
})));
// create a new user
exports.router.post('/', ((_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (isValidUserInput(_req.body)) {
            // check if unique
            const existingUser = yield user_1.User.findOne({
                where: {
                    username: _req.body.username
                }
            });
            if (existingUser) {
                res.status(400).json({ error: "User with the given username already exists." });
            }
            else {
                // create a new user
                const passwordHash = yield bcrypt_1.default.hash(_req.body.password, 10);
                const user = yield user_1.User.create({
                    username: _req.body.username,
                    password: passwordHash,
                });
                const token = jsonwebtoken_1.default.sign({ username: user.username, id: user.id }, config_1.SECRET);
                res.status(201).json({ username: user.username, token: token });
            }
        }
        else {
            res.status(400).json({ error: "Input is not a valid user input" });
        }
    }
    catch (error) {
        res.status(400).json({ error });
    }
})));
//# sourceMappingURL=users.js.map