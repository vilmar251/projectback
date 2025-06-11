import { Request, Response } from 'express';
import { inject } from 'inversify';
import { controller, httpDelete, httpGet, httpPost, request, response } from 'inversify-express-utils';
import { InversifyController } from '../../common/inversify.controller';
import { UserEntity } from '../../database/entities/user.entity';
import { UnauthorizedError } from '../../errors';
import logger from '../../logger/pino.logger';
import { jwtAuthMiddleware } from '../../middleware/jwt-auth.middleware';
import { roleAuthMiddleware } from '../../middleware/role-auth.middleware';
import { TYPES } from '../../types/types';
import { validate } from '../../validator';
import { LoginDto, RegistrationDto } from './dto';
import UserService from './user.service';

@controller('/user')
export default class UserController extends InversifyController {
  constructor(@inject(TYPES.UserService) private readonly userService: UserService) {
    super();
  }

  @httpPost('/register')
  private async register(@request() req: Request, @response() res: Response): Promise<void> {
    try {
      logger.info('Получен запрос на регистрацию', { body: JSON.stringify(req.body) });

      const dto = validate(RegistrationDto, req.body);
      logger.info('Данные прошли валидацию', { dto: JSON.stringify(dto) });

      const result = await this.userService.create(dto);
      logger.info('Пользователь успешно зарегистрирован', { email: result.email, userId: result.id });

      res.status(201).json(result);
    } catch (error: unknown) {
      logger.error('Ошибка в контроллере при регистрации', {
        error: (error as Error).message,
        stack: (error as Error).stack,
        body: JSON.stringify(req.body),
      });
      throw error;
    }
  }

  @httpPost('/login')
  private async login(@request() req: Request, @response() res: Response): Promise<void> {
    try {
      logger.info('Получен запрос на авторизацию', { body: JSON.stringify(req.body) });

      const dto = validate(LoginDto, req.body);
      logger.info('Данные прошли валидацию', { dto: JSON.stringify(dto) });

      const result = await this.userService.login(dto);
      logger.info('Успешная авторизация, токены сгенерированы', { userId: result.user.id });

      logger.info('Пользователь успешно авторизован', { email: result.user.email, userId: result.user.id });
      res.json(result);
    } catch (error: unknown) {
      logger.error('Ошибка в контроллере при авторизации', {
        error: (error as Error).message,
        stack: (error as Error).stack,
        body: JSON.stringify(req.body),
      });
      throw error;
    }
  }

  @httpPost('/refresh-token')
  private async refreshToken(@request() req: Request, @response() res: Response): Promise<void> {
    try {
      logger.info('Получен запрос на обновление токенов');

      const { refreshToken } = req.body;

      if (!refreshToken) {
        throw new UnauthorizedError('Refresh токен не предоставлен');
      }

      const tokens = await this.userService.refreshTokens(refreshToken);

      if (!tokens) {
        throw new UnauthorizedError('Невалидный refresh токен');
      }

      logger.info('Токены успешно обновлены');
      res.json(tokens);
    } catch (error: unknown) {
      logger.error('Ошибка при обновлении токенов', {
        error: (error as Error).message,
        stack: (error as Error).stack,
      });
      throw error;
    }
  }

  @httpDelete('/logout')
  private async logout(@request() req: Request, @response() res: Response): Promise<void> {
    try {
      logger.info('Получен запрос на выход из системы');

      const { refreshToken } = req.body;

      if (!refreshToken) {
        throw new UnauthorizedError('Refresh токен не предоставлен');
      }

      const success = await this.userService.logout(refreshToken);

      if (!success) {
        logger.warn('Не удалось удалить refresh токен');
      }

      logger.info('Пользователь успешно вышел из системы');
      res.json({ success: true, message: 'Выход из системы выполнен успешно' });
    } catch (error: unknown) {
      logger.error('Ошибка при выходе из системы', {
        error: (error as Error).message,
        stack: (error as Error).stack,
      });
      throw error;
    }
  }

  @httpGet('/profile', jwtAuthMiddleware())
  private async getProfile(@request() req: Request, @response() res: Response): Promise<void> {
    try {
      logger.info('Получен запрос на получение профиля пользователя', { userId: req.userId });

      if (!req.userId) {
        throw new UnauthorizedError('Пользователь не авторизован');
      }

      const user = await this.userService.getProfile(Number(req.userId));
      logger.info('Профиль пользователя получен успешно', { userId: req.userId, email: user.email });
      res.json(user);
    } catch (error: unknown) {
      logger.error('Ошибка при получении профиля пользователя', {
        userId: req.userId,
        error: (error as Error).message,
        stack: (error as Error).stack,
      });
      throw error;
    }
  }

  @httpGet('/admin-panel', jwtAuthMiddleware(), roleAuthMiddleware(['admin']))
  private async getAdminPanel(@request() req: Request, @response() res: Response): Promise<void> {
    try {
      logger.info('Получен запрос на доступ к панели администратора', { userId: req.userId, role: req.userRole });

      const users = await UserEntity.findAll();

      logger.info('Доступ к панели администратора предоставлен', { userId: req.userId, role: req.userRole });
      res.json({
        success: true,
        message: 'Доступ к панели администратора предоставлен',
        users: users.map((user) => ({
          id: user.id,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
        })),
      });
    } catch (error: unknown) {
      logger.error('Ошибка при доступе к панели администратора', {
        userId: req.userId,
        role: req.userRole,
        error: (error as Error).message,
        stack: (error as Error).stack,
      });
      throw error;
    }
  }

  @httpGet('/users', jwtAuthMiddleware(), roleAuthMiddleware(['admin']))
  private async getAllUsers(@request() req: Request, @response() res: Response): Promise<void> {
    try {
      logger.info('Получен запрос на получение списка всех пользователей', { userId: req.userId, role: req.userRole });

      const users = await this.userService.getAllUsers();

      logger.info(`Список пользователей успешно получен, количество: ${users.length}`, {
        userId: req.userId,
        role: req.userRole,
      });

      // Формируем ответ с безопасными данными пользователей (без паролей)
      const safeUsers = users.map((user) => ({
        id: user.id,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }));

      res.json({
        success: true,
        total: users.length,
        users: safeUsers,
      });
    } catch (error: unknown) {
      logger.error('Ошибка при получении списка пользователей', {
        userId: req.userId,
        role: req.userRole,
        error: (error as Error).message,
        stack: (error as Error).stack,
      });
      throw error;
    }
  }
}
