"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CHATGPT_API_KEY = exports.SECRET = exports.DB_NAME = exports.DB_PASS = exports.DB_USER = exports.DATABASE_URL = exports.PORT = void 0;
const dotenv = __importStar(require("dotenv"));
dotenv.config();
exports.PORT = process.env.PORT || 3002;
exports.DATABASE_URL = process.env.NODE_ENV === "test" ? process.env.TEST_DATABASE_URL : process.env.DATABASE_URL;
exports.DB_USER = process.env.DB_USER;
exports.DB_PASS = process.env.DB_PASS;
exports.DB_NAME = process.env.DB_NAME;
exports.SECRET = process.env.SECRET;
exports.CHATGPT_API_KEY = process.env.CHATGPT_API_KEY;
//# sourceMappingURL=config.js.map