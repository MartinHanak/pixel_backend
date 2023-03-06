import * as dotenv from "dotenv";

dotenv.config();

export const module = {
    "development": {
        "username" : process.env.DB_USER,
        "password" : process.env.DB_PASS,
        "database" : process.env.DB_NAME,
        "host" : "127.0.0.1",
        "dialect" : "postgres"
    },
    "test": {
        "username" : process.env.DB_USER,
        "password" : process.env.DB_PASS,
        "database" : process.env.DB_NAME,
        "host" : "127.0.0.1",
        "dialect" : "postgres"
    },
    "production" : {
        "username" : process.env.DB_USER,
        "password" : process.env.DB_PASS,
        "database" : process.env.DB_NAME,
        "host" : "127.0.0.1",
        "dialect" : "postgres"
    }
};