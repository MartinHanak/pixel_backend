import express from 'express';

const app = express();

import { PORT } from './util/config';
import { connectToDatabase } from './util/db';


app.use(express.json());


const start = async () => {
    await connectToDatabase();
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

start()
.catch(() => console.log("App failed at startup"));

/*
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

*/