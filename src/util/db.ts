import { Sequelize, SequelizeOptions } from "sequelize-typescript";
import { User } from "../models/user";

import { DATABASE_URL  } from './config';


export const sequelize = new Sequelize( DATABASE_URL  as string, {
    dialect: "postgres",
    logging: false,
    models: [User]
} as SequelizeOptions);


export const connectToDatabase = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync({force: true});
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        return process.exit(1);
    }

    return null;
};

