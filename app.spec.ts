import app from './src/app';
import { calculateDiscount } from './src/config/utils';
import request from 'supertest';

describe.skip('App', () => {
    it('should calculate discount', () => {
        const res = calculateDiscount(100, 10);
        expect(res).toBe(10);
    });

    it('should return 200 status', async () => {
        const response = await request(app).get('/').send();
        expect(response.statusCode).toBe(200);
    });
});
