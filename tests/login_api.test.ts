import supertest from 'supertest';
import app from '../src/app';
import {sequelize, connectToDatabase} from '../src/util/db';

const api = supertest(app);

beforeAll(async () => {
    //await sequelize.authenticate()
    //await sequelize.sync({force: true})
    await connectToDatabase();
})

test('login is successful', async () => {
    const response = await api.post('/api/login').send({username: 'Martin', password: '1234'})

    expect(response.status).toEqual(200);

    expect(response.body.token).toContain("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Ik1hcnRpbiIsImlkIjoxLCJpYXQiOjE2OD")
    expect(response.body.username).toEqual("Martin")
    
}, 100000 )

afterAll (async () => {
    await sequelize.close();
})