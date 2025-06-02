import { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from '../errors';
import { container } from '../inversify.config';
import logger from '../logger/pino.logger';
import { JwtServiceInterface } from '../services/jwt/jwt.types';
import { TYPES } from '../types/types';

// Расширяем типы Request
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      userId?: number;
      userRole?: string;
    }
  }
}

export const jwtAuthMiddleware = () => {
  return (req: Request, res: Response, next: NextFunction): void => {
    logger.info(`JWT Auth Middleware: Проверка запроса ${req.method} ${req.path}`);
    const authHeader = req.headers.authorization;
    const jwtService = container.get<JwtServiceInterface>(TYPES.JwtService);

    logger.info(`JWT Auth Middleware: Authorization header: ${authHeader ? 'присутствует' : 'отсутствует'}`);
    if (authHeader) {
      logger.info(`JWT Auth Middleware: Authorization header value: ${authHeader}`);
      logger.info(`JWT Auth Middleware: Starts with 'Bearer ': ${authHeader.startsWith('Bearer ')}`);
    }

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      logger.warn('Отсутствует или неверный формат токена авторизации');
      return next(new UnauthorizedError('Требуется авторизация'));
    }

    const token = authHeader.split(' ')[1];
    logger.info(`JWT Auth Middleware: Токен получен, пытаемся извлечь userId`);

    try {
      const userId = jwtService.extractUserIdFromToken(token);
      logger.info(`JWT Auth Middleware: Извлечен userId: ${userId}`);

      if (!userId) {
        logger.warn('Недействительный JWT токен - userId не найден');
        return next(new UnauthorizedError('Недействительный токен авторизации'));
      }

      const userRole = jwtService.extractRoleFromToken(token);
      logger.info(`JWT Auth Middleware: Извлечена роль пользователя: ${userRole || 'не указана'}`);

      req.userId = userId;
      req.userRole = userRole || 'user'; // По умолчанию роль 'user', если не указана
      logger.info(`JWT Auth Middleware: Аутентификация успешна, userId=${userId}, role=${req.userRole}`);

      return next();
    } catch (error) {
      logger.error(
        `JWT Auth Middleware: Ошибка при проверке токена: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`,
      );
      return next(new UnauthorizedError('Недействительный токен авторизации'));
    }
  };
};
