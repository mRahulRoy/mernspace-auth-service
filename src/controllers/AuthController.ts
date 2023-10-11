import fs from 'fs';
import path from 'path';
import { NextFunction, Response } from 'express';
import { JwtPayload, sign } from 'jsonwebtoken';
import { RegisterUserRequest } from '../types';
import { UserService } from '../services/UserService';
import { Logger } from 'winston';
import { validationResult } from 'express-validator';
import createHttpError from 'http-errors';
import { Config } from '../config';

export class AuthController {
    constructor(
        private userService: UserService,
        private logger: Logger,
    ) {}
    async register(
        req: RegisterUserRequest,
        res: Response,
        next: NextFunction,
    ) {
        //validation
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }

        const { firstName, lastName, password, email } = req.body;

        this.logger.debug('New request to registered user', {
            firstName,
            lastName,
            email,
            password: '******',
        });
        try {
            const user = await this.userService.create({
                firstName,
                lastName,
                password,
                email,
            });
            this.logger.info('User has been registered succesfully!');

            let privateKey: Buffer;
            try {
                privateKey = fs.readFileSync(
                    path.join(__dirname, '../../certs/private.pem'),
                );
            } catch (error) {
                const err = createHttpError(
                    500,
                    'Error while reading the private key',
                );
                next(err);
                return;
            }

            const payload: JwtPayload = {
                sub: String(user.id),
                role: user.role,
            };

            const accessToken = sign(payload, privateKey, {
                algorithm: 'RS256',
                expiresIn: '1h',
                issuer: 'auth-service',
            });

            const refreshToken = sign(payload, Config.REFRESH_TOKEN_SECRET!, {
                algorithm: 'HS256',
                expiresIn: '1y',
                issuer: 'auth-service',
            });

            res.cookie('accessToken', accessToken, {
                domain: 'localhost',
                sameSite: 'strict',
                maxAge: 1000 * 60 * 60,
                httpOnly: true,
            });
            res.cookie('refreshToken', refreshToken, {
                domain: 'localhost',
                sameSite: 'strict',
                maxAge: 1000 * 60 * 60 * 24 * 365,
                httpOnly: true,
            });

            res.status(201).json({
                id: user.id,
                role: user.role,
            });
        } catch (error) {
            next(error);
            return;
        }
    }
}

export default AuthController;
