import express from 'express';

import * as dotenv from "dotenv";
import { Sequelize, QueryTypes } from 'sequelize';

// setup config from .env file
dotenv.config();
// connect to database
const sequelize = new Sequelize(process.env.DATABASE_URL as string, {});
const main = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

main().then(()=>console.log('done')).catch((err)=>console.log(err));

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

// eslint-disable-next-line @typescript-eslint/no-misused-promises
app.get('/api/notes', async (_req,res) => {
    const notes = await sequelize.query("SELECT * FROM notes", {type: QueryTypes.SELECT});
    res.json(notes);
});

app.get('/ping', (_req, res) => {
    console.log('someone pinged here');
    res.send(`pong ${sequelize} `);
});

app.get('/', (_req, res) => {
    console.log('someone pinged here');
    res.send('pong');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});