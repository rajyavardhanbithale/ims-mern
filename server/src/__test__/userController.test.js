import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import userRoute from '../routes/userRoutes.js';
import connectDB from '../config/db.js';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());
app.use('/api/v1/user', userRoute);

beforeAll(async () => {
    await connectDB();
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('User Controller Tests', () => {
    let token;

    it('sign up a new user', async () => {
        const response = await request(app)
            .post('/api/v1/user/signup')
            .send({
                username: 'walter',
                email: 'walter@test.com',
                password: 'password123'
            });
        expect(response.status).toBe(201);
        expect(response.body.message).toBe('user registration completed');
    });

    it('log in an existing user', async () => {
        const response = await request(app)
            .post('/api/v1/user/login')
            .send({
                email: 'walter@test.com',
                password: 'password123'
            });
        expect(response.status).toBe(200);
        expect(response.body.token).toBeDefined();
        token = response.body.token; 
    });

    it('verify JWT token', async () => {
        const response = await request(app)
            .get('/api/v1/user/verify-jwt')
            .set('Cookie', `token=${token}`);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Authorized');
    });

    it('get user details', async () => {
        const response = await request(app)
            .get('/api/v1/user/get')
            .query({ username: 'walter' })
            .set('Cookie', `token=${token}`);
        expect(response.status).toBe(200);
        expect(response.body.username).toBe('walter');
    });

    it('update user details', async () => {
        const response = await request(app)
            .put('/api/v1/user/update/walter')
            .send({
                bio: 'Updated bio',
                contact: 1234567890
            })
            .set('Cookie', `token=${token}`);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('user updated');
    });

    it('deactivate user account', async () => {
        const response = await request(app)
            .patch('/api/v1/user/deactivate')
            .send({
                email: 'walter@test.com',
                password: 'password123'
            })
            .set('Cookie', `token=${token}`);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('user deactivated');
    });

    it('delete user account', async () => {
        const response = await request(app)
            .delete('/api/v1/user/delete')
            .send({
                email: 'walter@test.com',
                password: 'password123'
            });
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('user deleted');
    });
});
