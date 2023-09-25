import request = require('supertest');
import app from '../../src/app';

describe('POST /auth/register', () => {
    // happy path
    describe('Given all fields', () => {
        it('should return 201', async () => {
            // Arrange
            const userData = {
                name: 'Rahul',
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
                name: 'Rahul',
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
    });

    // sad path
    describe('Fileds are missing', () => {});
});

/*
NOTES

there are technique or formula that we use to write test cases.
            Which is AAA
Arange -> Arrange means arrange all the required data.
Act ->  Performa main work like caaling endpoints etc
Assert -> Here checks if we are getting expected output or not.

*/
