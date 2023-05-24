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
exports.errorHandler = exports.correctUser = exports.tokenExtractor = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("./config");
const game_1 = require("../models/game");
exports.tokenExtractor = ((_req, res, next) => {
    const authorization = _req.get('authorization');
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        try {
            res.locals.decodedToken = jsonwebtoken_1.default.verify(authorization.substring(7), config_1.SECRET);
            next();
        }
        catch (_a) {
            res.status(401).json({ error: 'token invalid' });
        }
    }
    else {
        res.status(401).json({ error: 'token not found' });
    }
});
exports.correctUser = ((_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // from previous middleware
    const userId = res.locals.decodedToken.id;
    if (!userId) {
        res.status(400).json({ error: 'no user id found in the received token' });
        return;
    }
    const gameId = Number(_req.params.id);
    if (!gameId) {
        res.status(400).json({ error: 'No game id found in request parameters.' });
        return;
    }
    const game = yield game_1.Game.findOne({
        where: {
            id: gameId
        }
    });
    if (!game) {
        res.status(400).json({ error: `Game with the given id of ${gameId} was not found` });
        return;
    }
    else if (game.userId !== userId) {
        res.status(401).json({ error: 'Current user is not authorized to interact with this game' });
        return;
    }
    next();
}));
exports.errorHandler = ((error, _request, res, next) => {
    console.log(error.message);
    res.status(400).json({ error: error.message });
    next(error);
});
//# sourceMappingURL=middleware.js.map