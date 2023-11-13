import request = require('supertest');
import { DataSource } from 'typeorm';
import { AppDataSource } from '../../src/config/data-source';
import app from '../../src/app';

describe('POST /auth/login', () => {
    let connection: DataSource;

    // This jest hook runs once before running the test cases
    beforeAll(async () => {
        connection = await AppDataSource.initialize();
    });

    //truncating Db before performing any new test cases, its important to do so that we can avoid tests conflicting to previous tests.
    beforeEach(async () => {
        await connection.dropDatabase();
        await connection.synchronize();
    });
    //closing the DB connection after performong all the test case s.
    afterAll(async () => {
        await connection.destroy();
    });

    // happy path
    describe('Given all fields', () => {
        it('should return 400 status code if email or password is missing ', async () => {
            // Arrange
            const userData = {
                email: 'rahulroy177602@gmail.com',
                password: ' ',
            };
            // Act
            const response = await request(app)
                .post('/auth/login')
                .send(userData);
            //Assert
            expect(response.statusCode).toBe(400);
        });
    });

    // Sad path
    describe('Fileds are missing', () => {});
});
