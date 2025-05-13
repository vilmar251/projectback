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

  private register = async (req: Request, res: Response): Promise<void> => {
    const dto = validate(RegistrationDto, req.body);
    const result = await userService.create(dto);
    logger.info('Пользователь успешно зарегистрирован', { email: result.email });
    res.status(201).json(result);
  };

  private login = async (req: Request, res: Response): Promise<void> => {
    const dto = validate(LoginDto, req.body);
    const result = await userService.login(dto);

    req.session.userId = result.id.toString();

    logger.info('Пользователь успешно авторизован', { email: result.email });
    res.json(result);
  };

  private getProfile = async (req: Request, res: Response): Promise<void> => {
    if (!req.session?.userId) {
      throw new UnauthorizedError('User is not authenticated');
    }
    const result = await userService.getProfile(Number(req.session.userId));
    res.json(result);
  };
}

export default new UserController();
