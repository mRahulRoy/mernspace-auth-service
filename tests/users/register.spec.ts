import request = require('supertest');
import app from '../../src/app';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../../src/config/data-source';

import { User } from '../../src/entity/User';
import { Roles } from '../../src/constants';

describe('POST /auth/register', () => {
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
        it('should return 201', async () => {
            // Arrange
            const userData = {
                firstName: 'Rahul',
                lastName: 'Kumar',
                email: 'rahulroy177602@gmail.com',
                password: '123',
            };
            // Act
            const response = await request(app)
                .post('/auth/register')
                .send(userData);
            // Assert
            expect(response.statusCode).toBe(201);
        });

        it('should return valid json reponse', async () => {
            // Arrange
            const userData = {
                firstName: 'Rahul',
                lastName: 'Kumar',
                email: 'rahulroy177602@gmail.com',
                password: '123',
            };
            // Act
            const response = await request(app)
                .post('/auth/register')
                .send(userData);
            /*
                In TypeScript, Record<string, string> is a way of saying that response.headers is expected to be an object where the keys are strings and the values are also strings.
                So, when you write response.headers as Record<string, string>, you're telling TypeScript to treat response.headers as an object with string keys and string values.

                Then, when you add ["content-type"] to it, you're essentially saying "give me the value associated with the key 'content-type' in the response.headers object".

                In simple terms, this part of the code is accessing a specific piece of information (in this case, the "content-type") from the headers of the response.
            */
            //Assert  application/json utf-8
            expect(
                (response.headers as Record<string, string>)['content-type'],
            ).toEqual(expect.stringContaining('json'));
        });

        it('should persist user in the database', async () => {
            // Arrange
            const userData = {
                firstName: 'Rahul',
                lastName: 'Kumar',
                email: 'rahulroy177602@gmail.com',
                password: '123',
            };
            // Act

            await request(app).post('/auth/register').send(userData);
            // Assert
            const userRepository = connection.getRepository(User);
            const user = await userRepository.find();
            expect(user).toHaveLength(1);
            //Here making sure if the above exact above data is getting stored in db or not.
            expect(user[0].firstName).toBe(userData.firstName);
            expect(user[0].lastName).toBe(userData.lastName);
            expect(user[0].email).toBe(userData.email);
        });

        it('should return the Id of newly created user', async () => {
            // Arrange
            const userData = {
                firstName: 'Rahul',
                lastName: 'Kumar',
                email: 'rahulroy177602@gmail.com',
                password: '123',
            };
            // Act

            const response = await request(app)
                .post('/auth/register')
                .send(userData);
            // Assert
            expect(response.body).toHaveProperty('id');
        });

        it('should assign a customer role', async () => {
            // Arrange
            const userData = {
                firstName: 'Rahul',
                lastName: 'Kumar',
                email: 'rahulroy177602@gmail.com',
                password: '123',
            };
            // Act
            await request(app).post('/auth/register').send(userData);
            // Assert
            const userRepository = connection.getRepository(User);
            const user = await userRepository.find();

            expect(user[0]).toHaveProperty('role');
            expect(user[0].role).toBe(Roles.CUSTOMER);
        });

        it('should store the hashed password in the database', async () => {
            // Arrange
            const userData = {
                firstName: 'Rahul',
                lastName: 'Kumar',
                email: 'rahulroy177602@gmail.com',
                password: '123',
            };
            // Act
            await request(app).post('/auth/register').send(userData);
            // Assert
            const userRepository = connection.getRepository(User);
            const user = await userRepository.find();
            expect(user[0].password).not.toBe(userData.password);
            expect(user[0].password).toHaveLength(60);
            //Here this regex is bassically checking if the hashed password is starting with '$2b' and next if it has '$ follwed by any positive integer' and after  that it should have '$' too.
            //basically it should look like this '$2b$10$'
            expect(user[0].password).toMatch(/^\$2b\$\d+\$/);
        });

        it('should return 400 status code if email already exists', async () => {
            // Arrange
            const userData = {
                firstName: 'Rahul',
                lastName: 'Kumar',
                email: 'rahulroy177602@gmail.com',
                password: '123',
            };
            const userRepository = connection.getRepository(User);
            //storing a user directly into the db
            await userRepository.save({ ...userData, role: Roles.CUSTOMER });

            // Act
            const response = await request(app)
                .post('/auth/register')
                .send(userData);

            const users = await userRepository.find();

            //Assert
            expect(response.statusCode).toBe(400);
            expect(users).toHaveLength(1);
        });
    });

    // sad path
    describe('Fileds are missing', () => {
        it('should return 400 status code if email field is missing', async () => {
            // Arrange
            const userData = {
                firstName: 'Rahul',
                lastName: 'Kumar',
                email: '',
                password: '123',
            };

            const userRepository = connection.getRepository(User);
            // Act
            const response = await request(app)
                .post('/auth/register')
                .send(userData);

            const users = await userRepository.find({});
            //Assert
            expect(response.statusCode).toBe(400);
            expect(users).toHaveLength(0);
        });
    });

    //Formating test cases
    describe('fields are not in proper format ', () => {
        it('should trim the email field', async () => {
            // Arrange
            const userData = {
                firstName: 'Rahul',
                lastName: 'Kumar',
                email: '   rahul@gmail.com  ',
                password: '123',
            };

            // Act
            const userRepository = connection.getRepository(User);
            await request(app).post('/auth/register').send(userData);

            const users = await userRepository.find();
            const user = users[0];
            expect(user.email).toBe('rahul@gmail.com');
        });
    });
});

/*
NOTES

there is a technique or a formula that we use to write test cases.
            Which is AAA
Arange -> Arrange means arrange all the required data.
Act ->  Performa main work like calling endpoints etc
Assert -> Here checks if we are getting expected output or not.

*/
