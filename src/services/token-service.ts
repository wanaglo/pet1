import jwt from 'jsonwebtoken';
import { tokenPayloadModel } from '../interfaces/token-payload-model';
import tokenRepository from '../repositories/token-repository';

class TokenService {
    generateTokens(payload: tokenPayloadModel) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET!, {
            expiresIn: '30m',
        });

        const refreshToken = jwt.sign(
            payload,
            process.env.JWT_REFRESH_SECRET!,
            { expiresIn: '30d' }
        );

        return {
            accessToken,
            refreshToken,
        };
    }

    validateRefreshToken(token: string) {
        try {
            return jwt.verify(token, process.env.JWT_REFRESH_SECRET!);
        } catch (err) {
            return null;
        }
    }

    validateAccessToken(token: string) {
        try {
            return jwt.verify(token, process.env.JWT_ACCESS_SECRET!);
        } catch (err) {
            return null;
        }
    }

    async findRefreshToken(token: string) {
        return await tokenRepository.findToken(token);
    }

    async saveRefreshToken(userId: string, token: string) {
        await tokenRepository.saveToken(userId, token);
    }

    async removeRefreshToken(token: string) {
        await tokenRepository.removeToken(token);
    }
}

export default new TokenService();
