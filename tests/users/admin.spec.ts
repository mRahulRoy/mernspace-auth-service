import { instantiateAdminUser } from '../../src/config/utils';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../../src/config/data-source';
import createJWKSMock from 'mock-jwks';
import { User } from '../../src/entity/User';

describe('admin tests', () => {
    let connection: DataSource;
    let jwks: ReturnType<typeof createJWKSMock>;

    beforeAll(async () => {
        jwks = createJWKSMock(`http://localhost:5501`);
        connection = await AppDataSource.initialize();
    });
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

    it('should create initial admin user in the system', async () => {
        const userRepository = connection.getRepository(User);
        const adminData = {
            firstName: 'Admin',
            lastName: 'User',
            email: 'admin001@gmail.com',
            password: '1234567****',
            role: 'admin',
        };

        await instantiateAdminUser(adminData);
        // trying to re create a admin for the signup just to make sure we dont store two or more admins.
        const retrySignup = await instantiateAdminUser(adminData);

        const initialAdmin = await userRepository.find({
            select: ['password', 'email', 'role'],
            where: {
                email: adminData.email,
                role: 'admin',
            },
        });
        console.log('password : ', initialAdmin[0]);
        expect(retrySignup).toBeFalsy();
        expect(initialAdmin[0].email).toBe(adminData.email);
        expect(initialAdmin[0].role).toEqual('admin');
        // expect(initialAdmin[0].password).toMatch(/^\$2[a|b]\$\d+\$/);
        expect(initialAdmin).toHaveLength(1);
    });
});
