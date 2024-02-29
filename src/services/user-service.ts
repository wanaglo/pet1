import { ApiError } from '../exeptions/api-error';
import userRepository from '../repositories/user-repository';
import bcrypt from 'bcrypt';
import * as uuid from 'uuid';
import mailService from './mail-service';
import tokenService from './token-service';
import { UserDto } from '../dtos/user-dto';

class UserService {
    async registration(email: string, password: string) {
        const candidate = await userRepository.findUserByEmail(email);

        if (candidate) {
            throw ApiError.BadRequestError(
                `Пользователь с почтовым адресом ${email} уже существует`
            );
        }

        const passHash = await bcrypt.hash(password, 8);

        const activationLink = uuid.v4();

        const newUser = await userRepository.createUser({
            email,
            password: passHash,
            activationLink,
        });

        await mailService.sendMailActivation(
            email,
            `${process.env.API_URL}/api/activate/${activationLink}`
        );

        const userDto = new UserDto(newUser);

        const tokens = tokenService.generateTokens({ ...userDto });

        await tokenService.saveRefreshToken(userDto.id, tokens.refreshToken);

        return {
            user: userDto,
            ...tokens,
        };
    }

    async login(email: string, password: string) {
        const user = await userRepository.findUserByEmail(email);

        if (!user) {
            throw ApiError.BadRequestError(
                `Пользователь с почтовым адресом ${email} не найден`
            );
        }

        const isEqualsPass = await bcrypt.compare(password, user.password);

        if (!isEqualsPass) {
            throw ApiError.BadRequestError('Введен не верный пароль');
        }

        const userDto = new UserDto(user);

        const tokens = tokenService.generateTokens({ ...userDto });

        await tokenService.saveRefreshToken(userDto.id, tokens.refreshToken);

        return {
            user: userDto,
            ...tokens,
        };
    }

    async forgot(email: string) {
        await mailService.resetAccauntPassword(
            email,
            `${process.env.API_URL}/api/reset`
        );
    }

    async logout(refreshToken: string) {
        await tokenService.removeRefreshToken(refreshToken);
    }

    async refresh(refreshToken: string) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError();
        }

        const userData = tokenService.validateRefreshToken(refreshToken);

        const tokenFromDb = await tokenService.findRefreshToken(refreshToken);

        if (!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError();
        }

        const newInfFromUser = await userRepository.findUserById(
            tokenFromDb.userId!
        );

        const userDto = new UserDto(newInfFromUser!);

        const tokens = tokenService.generateTokens({ ...userDto });

        await tokenService.saveRefreshToken(userDto.id, tokens.refreshToken);

        return {
            user: userDto,
            ...tokens,
        };
    }

    async activate(activationLink: string) {
        const userLink = await userRepository.findActivationLink(
            activationLink
        );

        if (!userLink) {
            throw ApiError.BadRequestError('Неккоректная ссылка активации');
        }

        await userRepository.activateUser(userLink._id);
    }

    async getUsers() {
        return await userRepository.findUsers();
    }
}

export default new UserService();
