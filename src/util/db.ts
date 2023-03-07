import {Sequelize } from "sequelize";

import { DATABASE_URL } from './config';


const sequelize = new Sequelize(DATABASE_URL as string , {});


export const connectToDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        return process.exit(1);
    }

    return null;
};

