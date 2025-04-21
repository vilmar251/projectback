import { Request, Response } from 'express';
import logger from '../../logger/pino.logger';
import { validate } from '../../validator';
import { LoginDto, RegistrationDto } from './dto';
import { userService } from './user.service';
import { BaseController } from '../base/base.controller';

export class UserController extends BaseController {
  constructor() {
    super();
  }

  protected setupRoutes(): void {
    this.addRoute('post', '/register', this.register);
    this.addRoute('post', '/login', this.login);
    this.addRoute('get', '/profile', this.getProfile);
    this.addRoute('put', '/profile', this.updateProfile);
    this.addRoute('delete', '/profile', this.deleteProfile);
  }

  private register(req: Request, res: Response): void {
    logger.info('POST /user/register - Регистрация пользователя', { 
      email: req.body.email 
    });
    const dto = validate(RegistrationDto, req.body);
    const result = userService.create(dto);
    logger.info('Пользователь успешно зарегистрирован', { email: result.email });
    res.json(result);
  }

  private login(req: Request, res: Response): void {
    logger.info('POST /user/login - Авторизация пользователя', { 
      email: req.body.email 
    });
    const dto = validate(LoginDto, req.body);
    const result = userService.login(dto);
    logger.info('Пользователь успешно авторизован', { email: result.email });
    res.json(result);
  }

  private getProfile(req: Request, res: Response): void {
    const userId = Number(req.session.id);
    logger.info('GET /user/profile - Получение профиля пользователя', { userId });
    const result = userService.getProfile(userId);
    res.json(result);
  }

  private updateProfile(req: Request, res: Response): void {
    logger.info('PUT /user/profile - Обновление профиля пользователя');
    res.status(501).json({ message: 'Not Implemented' });
  }

  private deleteProfile(req: Request, res: Response): void {
    logger.info('DELETE /user/profile - Удаление профиля пользователя');
    res.status(501).json({ message: 'Not Implemented' });
  }
}

export default new UserController().getRouter();
