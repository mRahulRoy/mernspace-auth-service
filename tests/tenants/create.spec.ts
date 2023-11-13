import request = require('supertest');
import { DataSource } from 'typeorm';
import { AppDataSource } from '../../src/config/data-source';
import app from '../../src/app';

describe('POST /tenants', () => {
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
        it('should return a 201 status code', async () => {
            const tenantData = {
                name: 'Tenant Name',
                address: 'tenant address',
            };
            //Act
            const response = await request(app)
                .post('/tenants')
                .send(tenantData);
            //Assert
            expect(response.statusCode).toBe(201);
        });
    });

    // Sad path
    describe('Fileds are missing', () => {});
});
