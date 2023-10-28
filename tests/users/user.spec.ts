import { DataSource } from 'typeorm';
import { AppDataSource } from '../../src/config/data-source';
import request from 'supertest';
import app from '../../src/app';
import createJWKSMock from 'mock-jwks';
import { User } from '../../src/entity/User';
import { Roles } from '../../src/constants';

describe('POST /auth/login', () => {
    let connection: DataSource;
    let jwks: ReturnType<typeof createJWKSMock>;

    // This jest hook runs once before running the test cases
    beforeAll(async () => {
        jwks = createJWKSMock(`http://localhost:5501`);
        connection = await AppDataSource.initialize();
    });

    //truncating Db before performing any new test cases, its important to do so that we can avoid tests conflicting to previous tests.
    beforeEach(async () => {
        jwks.start();
        await connection.dropDatabase();
        await connection.synchronize();
    });

    afterEach(() => {
        jwks.stop();
    });

    //closing the DB connection after performong all the test case s.
    afterAll(async () => {
        await connection.destroy();
    });

    // happy path
    describe('Given all fields', () => {
        it('Should return status Code 200', async () => {
            const accessToken = jwks.token({ sub: '1', role: Roles.CUSTOMER });

            const response = await request(app)
                .get('/auth/self')
                .set('Cookie', [`accessToken=${accessToken}`])
                .send();
            expect(response.statusCode).toBe(200);
        });

        it('Should return user data', async () => {
            // Register user
            const userData = {
                firstName: 'rahul',
                lastName: 'kumar',
                email: 'rahu@gmail.com',
                password: '123456789',
            };
            const userRepository = connection.getRepository(User);
            const data = await userRepository.save({
                ...userData,
                role: Roles.CUSTOMER,
            });
            // Generate token
            const accessToken = jwks.token({
                sub: String(data.id),
                role: data.role,
            });

            // Add token to cookie
            const response = await request(app)
                .get('/auth/self')
                .set('Cookie', [`accessToken=${accessToken};`])
                .send();
            // Assert
            //check if user id matches with the resgitered user.
            expect((response.body as Record<string, string>).id).toBe(data.id);
        });
    });

    // Sad path
    describe('Fileds are missing', () => {});
});
