import { Request, Response, NextFunction } from 'express';
import { userViewModel } from '../interfaces/user-view-model';
import { validationResult } from 'express-validator';
import { ApiError } from '../exeptions/api-error';
import userService from '../services/user-service';

class AuthController {
    async registration(
        req: Request,
        res: Response<userViewModel>,
        next: NextFunction
    ) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                throw ApiError.BadRequestError(
                    'Ошибка при валидации',
                    errors.array()
                );
            }

            const { email, password } = req.body;

            const userData = await userService.registration(email, password);

            res.cookie('refreshToken', userData.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true,
            });

            res.json(userData);
        } catch (err) {
            next(err);
        }
    }

    async login(
        req: Request,
        res: Response<userViewModel>,
        next: NextFunction
    ) {
        try {
            const { email, password } = req.body;

            const userData = await userService.login(email, password);

            res.cookie('refreshToken', userData.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true,
            });

            res.json(userData);
        } catch (err) {
            next(err);
        }
    }

    async forgot(req: Request, res: Response, next: NextFunction) {
        try {
            const { email } = req.body;

            await userService.forgot(email);

            res.json({
                message:
                    'Отправлено письмо на почтовый адрес для сброса пароля',
            });
        } catch (err) {
            next(err);
        }
    }

    async reset(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body;
        } catch (err) {
            next(err);
        }
    }

    async logout(req: Request, res: Response, next: NextFunction) {
        try {
            const { refreshToken } = req.cookies;

            await userService.logout(refreshToken);

            res.clearCookie('refreshToken');

            res.json({ message: 'Вы вышли из аккаунта' });
        } catch (err) {
            next(err);
        }
    }

    async refresh(req: Request, res: Response, next: NextFunction) {
        try {
            const { refreshToken } = req.cookies;

            const userData = await userService.refresh(refreshToken);

            res.cookie('refreshToken', userData.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true,
            });

            res.json(userData);
        } catch (err) {
            next(err);
        }
    }

    async activate(req: Request, res: Response, next: NextFunction) {
        try {
            const activationLink = req.params.link;

            await userService.activate(activationLink);

            res.redirect(process.env.CLIENT_URL!);
        } catch (err) {
            next(err);
        }
    }

    async getUsers(req: Request, res: Response, next: NextFunction) {
        try {
            const users = await userService.getUsers();

            res.json(users);
        } catch (err) {
            next(err);
        }
    }
}

export default new AuthController();
