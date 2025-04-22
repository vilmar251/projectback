import { Request, Response } from 'express';
import { BaseController } from '../../common';
import { UnauthorizedError } from '../../errors';
import logger from '../../logger/pino.logger';
import { validate } from '../../validator';
import { LoginDto, RegistrationDto } from './dto';
import { userService } from './user.service';

export class UserController extends BaseController {
  constructor() {
    super();

    this.initRoutes();
  }

  initRoutes(): void {
    this.addRoute({ method: 'post', path: '/register', handler: this.register });
    this.addRoute({ method: 'post', path: '/login', handler: this.login });
    this.addRoute({ method: 'get', path: '/profile', handler: this.getProfile });
  }

  private register = (req: Request, res: Response): void => {
    const dto = validate(RegistrationDto, req.body);
    const result = userService.create(dto);
    logger.info('Пользователь успешно зарегистрирован', { email: result.email });
    res.status(201).json(result);
  };

  private login = (req: Request, res: Response): void => {
    const dto = validate(LoginDto, req.body);
    const result = userService.login(dto);

    req.session.userId = result.id;

    logger.info('Пользователь успешно авторизован', { email: result.email });
    res.json(result);
  };

  private getProfile = (req: Request, res: Response): void => {
    if (!req.session?.userId) {
      throw new UnauthorizedError('User is not authenticated');
    }
    const result = userService.getProfile(req.session.userId);
    res.json(result);
  };
}

export default new UserController();
