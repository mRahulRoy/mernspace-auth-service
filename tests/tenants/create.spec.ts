import request = require('supertest');
import { DataSource } from 'typeorm';
import { AppDataSource } from '../../src/config/data-source';
import app from '../../src/app';
import { Tenant } from '../../src/entity/Tenants';
import createJWKSMock from 'mock-jwks';
import { Roles } from '../../src/constants';

describe('POST /tenants', () => {
    let connection: DataSource;
    let jwks: ReturnType<typeof createJWKSMock>;
    let adminToken: string;
    // This jest hook runs once before running the test cases
    beforeAll(async () => {
        jwks = createJWKSMock(`http://localhost:5501`);
        connection = await AppDataSource.initialize();
    });

    //truncating Db before performing any new test cases, its important to do so that we can avoid tests conflicting to previous tests.
    beforeEach(async () => {
        await connection.dropDatabase();
        await connection.synchronize();
        jwks.start();

        adminToken = jwks.token({
            sub: '1',
            role: Roles.ADMIN,
        });
    });
    afterEach(async () => {
        jwks.stop();
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
                .set('Cookie', [`accessToken=${adminToken}`])
                .send(tenantData);
            //Assert
            expect(response.statusCode).toBe(201);
        });
        it('should create a tenant in the database', async () => {
            const tenantData = {
                name: 'Tenant Name',
                address: 'tenant address',
            };
            //Act
            await request(app)
                .post('/tenants')
                .set('Cookie', [`accessToken=${adminToken}`])
                .send(tenantData);

            const tenantRepository = connection.getRepository(Tenant);
            const tenants = await tenantRepository.find();

            //Assert
            expect(tenants).toHaveLength(1);
            expect(tenants[0].name).toBe(tenantData.name);
            expect(tenants[0].address).toBe(tenantData.address);
        });
        it('should return 401 if user is not authenticated', async () => {
            const tenantData = {
                name: 'Tenant Name',
                address: 'tenant address',
            };
            //Act
            const response = await request(app)
                .post('/tenants')
                .send(tenantData);
            expect(response.statusCode).toBe(401);

            const tenantRepository = connection.getRepository(Tenant);
            const tenants = await tenantRepository.find();

            //Assert
            expect(tenants).toHaveLength(0);
        });
        it('should return 403 if user is not an admin', async () => {
            const managerToken = jwks.token({
                sub: '1',
                role: Roles.MANAGER,
            });

            const tenantData = {
                name: 'Tenant Name',
                address: 'tenant address',
            };
            //Act
            const response = await request(app)
                .post('/tenants')
                .set('Cookie', [`accessToken=${managerToken}`])
                .send(tenantData);

            const tenantRepository = connection.getRepository(Tenant);
            const tenants = await tenantRepository.find();

            //Assert
            expect(response.statusCode).toBe(403);
            expect(tenants).toHaveLength(0);
        });
    });

    // Sad path
    describe('Fileds are missing', () => {});
});
