import { TokenModel } from '../models/Token-model';

class TokenRepository {
    async findToken(token: string) {
        return await TokenModel.findOne({ refreshToken: token });
    }

    async saveToken(userId: string, token: string) {
        const tokenData = await TokenModel.findOne({ userId });

        if (tokenData) {
            tokenData.refreshToken = token;

            return await tokenData.save();
        }

        await TokenModel.create({ userId, refreshToken: token });
    }

    async removeToken(token: string) {
        await TokenModel.deleteOne({ refreshToken: token });
    }
}

export default new TokenRepository();
