import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { controller, httpGet, httpPost, request, response } from 'inversify-express-utils';
import { InversifyController } from '../../common/inversify.controller';
import { UnauthorizedError } from '../../errors';
import logger from '../../logger/pino.logger';
import { TYPES } from '../../types/types';
import { validate } from '../../validator';
import { LoginDto, RegistrationDto } from './dto';
import UserService from './user.service';

@controller('/user')
export default class UserController extends InversifyController {
  constructor(
    @inject(TYPES.UserService) private readonly userService: UserService
  ) {
    super();
  }



  @httpPost('/register')
  private async register(@request() req: Request, @response() res: Response): Promise<void> {
    const dto = validate(RegistrationDto, req.body);
    const result = await this.userService.create(dto);
    logger.info('Пользователь успешно зарегистрирован', { email: result.email });
    res.status(201).json(result);
  }

  @httpPost('/login')
  private async login(@request() req: Request, @response() res: Response): Promise<void> {
    const dto = validate(LoginDto, req.body);
    const result = await this.userService.login(dto);

    req.session.userId = result.id.toString();

    logger.info('Пользователь успешно авторизован', { email: result.email });
    res.json(result);
  }

  @httpGet('/profile')
  private async getProfile(@request() req: Request, @response() res: Response): Promise<void> {
    if (!req.session?.userId) {
      throw new UnauthorizedError('User is not authenticated');
    }
    const result = await this.userService.getProfile(Number(req.session.userId));
    res.json(result);
  }
}
