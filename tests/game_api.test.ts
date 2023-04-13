import supertest from 'supertest';
import app from '../src/app';
import {sequelize, connectToDatabase} from '../src/util/db';

const api = supertest(app);

beforeAll(async () => {
    //await sequelize.authenticate()
    //await sequelize.sync({force: true})
    await connectToDatabase();
})

test('get last game id for logged in user is successful', async () => {
    const response = await api.get('/api/game').set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ik1hcnRpbiIsImlkIjoxLCJpYXQiOjE2ODA3OTE1Njd9.lZPV0hRSY6Pvpl8R8_LfpWCNOR0W3JbSss-fsjd93s8")

    expect(response.status).toEqual(200)
    expect(response.body.gameId).not.toBeNull();
    
}, 100000 )


test('creating a new game for logged-in user is possible', async () => {
    const response = await api.post('/api/game').set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ik1hcnRpbiIsImlkIjoxLCJpYXQiOjE2ODA3OTE1Njd9.lZPV0hRSY6Pvpl8R8_LfpWCNOR0W3JbSss-fsjd93s8")

    expect(response.status).toEqual(200)
    expect(response.body.gameId).not.toBeNull();
}, 100000 )


test('getting last game info is possible', async () => {
    // login
    const responseLogin = await api.post('/api/login').send({username: 'Martin', password: '1234'})
    expect(responseLogin.status).toEqual(200);
    expect(responseLogin.body.token).not.toBeNull();

    //const username = responseLogin.body.username;
    const token = responseLogin.body.token;

    // get id
    const responseForId = await api.get('/api/game').set("Authorization", `Bearer ${token}`)
    expect(responseForId.status).toEqual(200);
    const gameId = responseForId.body.gameId;

    const response = await api.get(`/api/game/${gameId}`).set("Authorization", `Bearer ${token}`);


    expect(response.status).toEqual(200);


}, 100000 )

/*
test('generating a new question', async () => {
    // login
    const responseLogin = await api.post('/api/login').send({username: 'Martin', password: '1234'})
    expect(responseLogin.status).toEqual(200);
    expect(responseLogin.body.token).not.toBeNull();

    //const username = responseLogin.body.username;
    const token = responseLogin.body.token;

    // get id
    const responseForId = await api.get('/api/game').set("Authorization", `Bearer ${token}`)
    expect(responseForId.status).toEqual(200);
    const gameId = responseForId.body.gameId;


    const response = await api.post(`/api/game/${gameId}/1`).set("Authorization", `Bearer ${token}`)

    expect(response.status).toEqual(200);
}, 100000);
*/

afterAll (async () => {
    await sequelize.close();
})