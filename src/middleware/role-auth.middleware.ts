import { NextFunction, Request, Response } from 'express';
import { ForbiddenError } from '../errors';
import logger from '../logger/pino.logger';

export const roleAuthMiddleware = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    logger.info(`Role Auth Middleware: Проверка доступа для роли ${req.userRole}`);

    if (!req.userId || !req.userRole) {
      logger.warn('Role Auth Middleware: Пользователь не аутентифицирован');
      return next(new ForbiddenError('Доступ запрещен'));
    }

    if (!roles.includes(req.userRole)) {
      logger.warn(
        `Role Auth Middleware: Недостаточно прав для доступа. Роль пользователя: ${req.userRole}, требуемые роли: ${roles.join(', ')}`,
      );
      return next(new ForbiddenError('Недостаточно прав для доступа'));
    }

    logger.info(`Role Auth Middleware: Доступ разрешен для пользователя с ролью ${req.userRole}`);
    return next();
  };
};
