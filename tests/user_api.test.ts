import supertest from 'supertest';
import app from '../src/app';
import {sequelize} from '../src/util/db';

const api = supertest(app);

beforeAll(async () => {
    await sequelize.authenticate()
    await sequelize.sync({force: true})
})

test('users are returned as json', async () => {
    await api
    .get('/api/users')
    .expect(200)
    .expect('Content-Type', /application\/json/)
}, 100000 )

afterAll (async () => {
    await sequelize.close();
})