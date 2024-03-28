import { NextFunction, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { AuthRequest, RegisterUserRequest } from '../types';
import { UserService } from '../services/UserService';
import { Logger } from 'winston';
import { validationResult } from 'express-validator';
import { TokenService } from '../services/TokenService';
import createHttpError from 'http-errors';

import { CredentialService } from '../services/CredentialService';
import { Roles } from '../constants';

export class AuthController {
    constructor(
        private userService: UserService,
        private logger: Logger,
        private tokenService: TokenService,
        private credentialService: CredentialService,
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
                role: Roles.CUSTOMER,
            });
            this.logger.info('User has been registered succesfully!');

            const payload: JwtPayload = {
                sub: String(user.id),
                role: user.role,
            };

            const accessToken = this.tokenService.generateAccessToken(payload);

            const newRefreshToken =
                await this.tokenService.persistRefreshToken(user);

            const refreshToken = this.tokenService.generateRefreshToken({
                ...payload,
                id: String(newRefreshToken.id),
            });

            res.cookie('accessToken', accessToken, {
                domain: 'localhost',
                sameSite: 'strict',
                maxAge: 1000 * 60 * 60, //1 hr
                httpOnly: true, //very imp
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

    async login(req: RegisterUserRequest, res: Response, next: NextFunction) {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }

        const { password, email } = req.body;

        this.logger.debug('New request to login user', {
            email,
            password: '******',
        });

        //check if user exits in database
        //compare password
        //Generate Tokens
        //Add token to cookies
        //Return the response (id)

        try {
            const user = await this.userService.findByEmailWithPassword(email);

            if (!user) {
                const error = createHttpError(
                    400,
                    'email or password is incorrect!',
                );
                next(error);
                return;
            }

            const passwordMatch = await this.credentialService.comparePassword(
                password,
                user.password,
            );
            if (!passwordMatch) {
                const error = createHttpError(
                    400,
                    'email or password is incorrect!',
                );
                next(error);
                return;
            }

            const payload: JwtPayload = {
                sub: String(user.id),
                role: user.role,
                tenant: user.tenant ? String(user.tenant.id) : ""
            };

            const accessToken = this.tokenService.generateAccessToken(payload);

            //creating a refresh token record/document/row only not storing that token in db.
            const newRefreshToken =
                await this.tokenService.persistRefreshToken(user);

            const refreshToken = this.tokenService.generateRefreshToken({
                ...payload,
                id: String(newRefreshToken.id),
            });

            res.cookie('accessToken', accessToken, {
                domain: 'localhost',
                sameSite: 'strict',
                maxAge: 1000 * 60 * 60, //1 hr
                httpOnly: true, //very imp
            });

            res.cookie('refreshToken', refreshToken, {
                domain: 'localhost',
                sameSite: 'strict',
                maxAge: 1000 * 60 * 60 * 24 * 365,
                httpOnly: true,
            });

            this.logger.info('User has been logged in', { id: user.id });
            res.status(200).json({
                id: user.id,
                role: user.role,
            });
        } catch (error) {
            next(error);
            return;
        }
    }

    async self(req: AuthRequest, res: Response) {
        const user = await this.userService.findById(Number(req.auth.sub));
        res.json({ ...user, password: undefined });
    }

    async refresh(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const payload: JwtPayload = {
                sub: req.auth.sub,
                role: req.auth.role,
                tenant:req.auth.tenant,
            };

            const accessToken = this.tokenService.generateAccessToken(payload);
            const user = await this.userService.findById(Number(req.auth.sub));
            if (!user) {
                const error = createHttpError(
                    401,
                    'User with the token could not be found',
                );
                next(error);
                return;
            }
            //persist the new refresh token record in the db
            const newRefreshToken =
                await this.tokenService.persistRefreshToken(user);
            //deleting the old refresh token
            await this.tokenService.deleteRefreshToken(Number(req.auth.id));

            const refreshToken = this.tokenService.generateRefreshToken({
                ...payload,
                id: String(newRefreshToken.id),
            });

            res.cookie('accessToken', accessToken, {
                domain: 'localhost',
                sameSite: 'strict',
                maxAge: 1000 * 60 * 60, //1 hr
                httpOnly: true, //very imp
            });

            res.cookie('refreshToken', refreshToken, {
                domain: 'localhost',
                sameSite: 'strict',
                maxAge: 1000 * 60 * 60 * 24 * 365,
                httpOnly: true,
            });
            res.json({ id: user.id });
        } catch (error) {
            next(error);
            return;
        }
    }

    /*
    explanation of why we have multiple refreshToken for same user.
    Since one user can login to multiple devices so it should not be like if a user logouts from the one device it will logout that user from the other devices as well .
    so each refreshToken represents the number of devices in which user is curren;tly logged-In.
    so when a user clicks on logout , it then sends a refreshToken from the cookie to server than there server validates if this valid or not if its valid then that middlewate sets the refreshToken in the req' auth object and returns , then actul logout function gets called and from there using req.auth.id which is tokenId , we find it in db and delets it. in this way a user logsOut from that particular device.

    
    */
    async logout(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            await this.tokenService.deleteRefreshToken(Number(req.auth.id));
            this.logger.info('User has been logged out : ', {
                id: req.auth.id,
            });
            res.clearCookie('accessToken');
            res.clearCookie('refreshToken');
            res.json({ message: 'user has been logged out.' });
        } catch (error) {
            next(error);
            return;
        }
    }
}

export default AuthController;
