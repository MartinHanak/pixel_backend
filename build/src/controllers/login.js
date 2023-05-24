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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../util/config");
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_1 = require("../models/user");
exports.router = express_1.default.Router();
const correctInputFormat = (_req, res, next) => {
    if (!(_req.body.username && _req.body.password)) {
        res.status(400).json({ error: "Input does not contain username or password" });
        return;
    }
    else {
        next();
    }
};
const userExists = ((_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_1.User.findOne({
        where: {
            username: _req.body.username
        }
    });
    if (!user) {
        res.status(404).json({ error: "User does not exists." });
        return;
    }
    else {
        res.locals.user = user;
        next();
    }
}));
const passwordMatch = ((_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const match = yield bcrypt_1.default.compare(_req.body.password, res.locals.user.password);
    if (!match) {
        res.status(400).json({ error: "Password for the given username is not correct." });
        return;
    }
    next();
}));
exports.router.post('/', correctInputFormat, userExists, passwordMatch, ((_req, res) => {
    try {
        const user = res.locals.user;
        const token = jsonwebtoken_1.default.sign({ username: user.username, id: user.id }, config_1.SECRET);
        res.status(200).send({ token, username: user.username });
    }
    catch (error) {
        res.status(400).json({ error });
    }
}));
//# sourceMappingURL=login.js.map