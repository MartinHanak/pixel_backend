import * as dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT || 3002;

export const DATABASE_URL = process.env.NODE_ENV === "development" ? process.env.TEST_DATABASE_URL : process.env.DATABASE_URL;


export const DB_USER = process.env.DB_USER;
export const DB_PASS = process.env.DB_PASS;
export const DB_NAME = process.env.DB_NAME;

export const SECRET = process.env.SECRET;


export const CHATGPT_API_KEY = process.env.CHATGPT_API_KEY;
