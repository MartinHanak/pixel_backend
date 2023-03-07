import { Sequelize, SequelizeOptions } from "sequelize-typescript";
import { User } from "../models/user";

import {DATABASE_URL, DB_NAME } from './config';


const sequelize = new Sequelize( DATABASE_URL  as string, {
    dialect: "postgres",
    logging: false,
    models: [User]
} as SequelizeOptions);


export const connectToDatabase = async () => {
    try {
        console.log(DB_NAME);
        await sequelize.authenticate();
        await sequelize.sync();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        return process.exit(1);
    }

    return null;
};

