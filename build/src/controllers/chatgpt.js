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
exports.router = express_1.default.Router();
const chatgpt_1 = require("../models/chatgpt");
exports.router.get('/', ((_req, res) => {
    res.status(200).json({ message: "ChatGPT api online" });
}));
exports.router.post('/', ((_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield chatgpt_1.chatGPTInterface.getNextQuestion(0, 0);
        res.status(200).send(response);
    }
    catch (err) {
        res.status(400).json({ error: err });
    }
})));
//# sourceMappingURL=chatgpt.js.map