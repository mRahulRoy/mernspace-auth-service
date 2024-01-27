import createHttpError from 'http-errors';
import { JwtPayload, sign } from 'jsonwebtoken';
import { Config } from '../config';
import { User } from '../entity/User';
import { RefreshToken } from '../entity/RefreshToken';
import { Repository } from 'typeorm';

export class TokenService {
    constructor(private refreshTokenRepository: Repository<RefreshToken>) {}

    generateAccessToken(payload: JwtPayload) {
        let privateKey: string;
        if (!Config.PRIVATE_KEY) {
            const err = createHttpError(500, 'SECRET_KEY is not set.');
            throw err;
        }

        try {
            privateKey = Config.PRIVATE_KEY!;
        } catch (error) {
            const err = createHttpError(
                500,
                'Error while reading the private key',
            );
            throw err;
        }

        const accessToken = sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '2h',
            issuer: 'auth-service',
        });
        return accessToken;
    }

    generateRefreshToken(payload: JwtPayload) {
        const refreshToken = sign(payload, Config.REFRESH_TOKEN_SECRET!, {
            algorithm: 'HS256',
            expiresIn: '1y',
            issuer: 'auth-service',
            jwtid: String(payload.id),
        });

        return refreshToken;
    }

    async persistRefreshToken(user: User) {
        //persist the access token in the database
        const MS_IN_YEAR = 1000 * 60 * 60 * 24 * 365; //1YR

        const newRefreshToken = this.refreshTokenRepository.save({
            user: user,
            expiresAt: new Date(Date.now() + MS_IN_YEAR),
        });

        return newRefreshToken;
    }

    async deleteRefreshToken(tokenId: number) {
        return await this.refreshTokenRepository.delete({ id: tokenId });
    }
}
