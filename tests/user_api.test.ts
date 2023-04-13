import supertest from 'supertest';
import app from '../src/app';
import {sequelize, connectToDatabase} from '../src/util/db';

const api = supertest(app);

beforeAll(async () => {
    //await sequelize.authenticate()
    //await sequelize.sync({force: true})
    await connectToDatabase();
})

test('users are returned as json', async () => {
    await api
    .get('/api/users')
    .expect(200)
    .expect('Content-Type', /application\/json/)
}, 100000 )


test('get user by id', async () => {
    const response = await api.get('/api/users/1')

    expect(response.status).toEqual(200)
    expect(response.body.username).toEqual('Martin')
},100000) 

test('new user has to have a unique name', async () => {
    const response = await api.post('/api/users').send({username: 'Martin', password: '1234'})

    expect(response.status).toEqual(400);
},100000);

test('creating a new user requires username and password', async () => {
    const response = await api.post('/api/users').send({username: 'sth'});

     expect(response.status).toEqual(400);
},100000)


test('creating a new user with correct input works', async () => {
    const currentDate = Date.now();
    const newUsername = `Martin_${currentDate}`;

    const response = await api.post('/api/users').send({username: newUsername, password: '1234'});

    expect(response.status).toEqual(201)
    expect(response.body.username).toEqual(newUsername);
    expect(response.body.token).not.toBeNull();

},100000)

afterAll (async () => {
    await sequelize.close();
})