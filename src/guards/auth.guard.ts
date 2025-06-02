import { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from '../errors';
import logger from '../logger/pino.logger';

// Оставлен для обратной совместимости
export const AuthGuard = (req: Request, res: Response, next: NextFunction): void => {
  logger.warn('Используется устаревший AuthGuard. Рекомендуется использовать jwtAuthMiddleware');

  if (!req.userId) {
    return next(new UnauthorizedError('Требуется авторизация'));
  }

  return next();
};
