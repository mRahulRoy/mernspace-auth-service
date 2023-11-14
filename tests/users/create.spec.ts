import { DataSource } from 'typeorm';
import { AppDataSource } from '../../src/config/data-source';
import request from 'supertest';
import app from '../../src/app';
import createJWKSMock from 'mock-jwks';
import { Roles } from '../../src/constants';
import { User } from '../../src/entity/User';

describe('POST /users', () => {
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
        it('should persist the user in the database', async () => {
            const adminToken = jwks.token({ sub: '1', role: Roles.ADMIN });

            // Register user
            const userData = {
                firstName: 'Rakesh',
                lastName: 'K',
                email: 'rakesh@mern.space',
                password: 'password',
                tenantId: 1,
            };

            // Add token to cookie
            await request(app)
                .post('/users')
                .set('Cookie', [`accessToken=${adminToken};`])
                .send(userData);
            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();
            // Assert
            expect(users).toHaveLength(1);

            expect(users[0].email).toBe(userData.email);
        });
        it('should create a manager user', async () => {
            const adminToken = jwks.token({ sub: '1', role: Roles.ADMIN });

            // Register user
            const userData = {
                firstName: 'Rakesh',
                lastName: 'K',
                email: 'rakesh@mern.space',
                password: 'password',
                tenantId: 1,
            };

            // Add token to cookie
            await request(app)
                .post('/users')
                .set('Cookie', [`accessToken=${adminToken};`])
                .send(userData);
            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();
            // Assert
            expect(users).toHaveLength(1);

            expect(users[0].role).toBe(Roles.MANAGER);
        });

        it.todo('should return 403 if non Admin user tries to create a user');
    });

    // Sad path
    describe('Fileds are missing', () => {});
});
