import { Request, Response } from 'express';
import { inject } from 'inversify';
import { controller, httpGet, httpPost, request, response } from 'inversify-express-utils';
import { jwtAuthMiddleware } from '../../middleware/jwt-auth.middleware';
import { InversifyController } from '../../common/inversify.controller';
import { UnauthorizedError } from '../../errors';
import logger from '../../logger/pino.logger';
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
      logger.info('Успешная авторизация, токен сгенерирован', { userId: result.user.id });

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

  @httpGet('/profile', jwtAuthMiddleware())
  private async getProfile(@request() req: Request, @response() res: Response): Promise<void> {
    const result = await this.userService.getProfile(Number(req.userId));
    res.json(result);
  }
}
