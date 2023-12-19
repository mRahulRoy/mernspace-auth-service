import { DataSource } from 'typeorm';
import { AppDataSource } from '../../src/config/data-source';
import request from 'supertest';
import app from '../../src/app';
import createJWKSMock from 'mock-jwks';
import { Roles } from '../../src/constants';
import { User } from '../../src/entity/User';
import { createTenant } from '../utils';
import { Tenant } from '../../src/entity/Tenants';
// import { instantiateAdminUser } from '../../src/config/utils';

/*
    ----- One minute read for the mock-jwks library -----
As we know we have used token based mechanism for secure authentication. We have used RSA256 that is an asymmetric algorithm that uses a public/private key pair. So at the time of login or register we are creating access and refreshtoken using private key and sending it to the client in the cookie that is of type httpOnly , and we know that we can only verify that access token using the private key corresponding to that private key.
also jwk is genearated using private key but only the public part of it is visible.
This is how JWK is created.
const jwk = rsaPemToJwk(privateKey, { use: 'sig' }, 'public');

So The public key used for verification of accesstoken is often represented in a `JWK format` .
This formated public key in jwk type is used for token verification. 


Now the thing is at the time of testing those services which needs to be authenticate before allowing to access the resources should have a jwk that was created
but at the time of testing we need to pass some valid jwks to autheticate or verify the accesstoken for the access of the required resource.

Thats why we have insead of passing the real jsonwebkey , we are mocking the exact copy of that key and passing it .
now let see what we get in  :

import createJWKSMock from 'mock-jwks';
 jwks = createJWKSMock(`http://localhost:5501`); we have to pass the domain 
 it returns ->  
  jwks = {
      start: [Function: start],
      stop: [Function: stop],
      kid: [Function: kid],
      token: [Function: token]
    }
we need to start and stop the jwk mocking after each test just like this ->  jwks.start()/ jwks.stop();
const token = jwks.token({ sub: '1', role: Roles.ADMIN })





*/

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
            //Create the tenant first
            const tenant = await createTenant(connection.getRepository(Tenant));
            const adminToken = jwks.token({ sub: '1', role: Roles.ADMIN });

            // Register user
            const userData = {
                firstName: 'Rakesh',
                lastName: 'K',
                email: 'rakesh@mern.space',
                password: 'password',
                role: Roles.MANAGER,
                tenantId: tenant.id,
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
            //Create the tenant first
            const tenant = await createTenant(connection.getRepository(Tenant));

            const adminToken = jwks.token({ sub: '1', role: Roles.ADMIN });

            // Register user
            const userData = {
                firstName: 'Rakesh',
                lastName: 'K',
                email: 'rakesh@mern.space',
                password: 'password',
                role: Roles.MANAGER,
                tenantId: tenant.id,
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
