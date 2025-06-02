import { NextFunction, Request, Response } from 'express';
import { container } from '../inversify.config';
import { UnauthorizedError } from '../errors';
import { TYPES } from '../types/types';
import { JwtServiceInterface } from '../services/jwt/jwt.types';
import logger from '../logger/pino.logger';

// Расширяем интерфейс Request для добавления userId
declare global {
  namespace Express {
    interface Request {
      userId?: number;
    }
  }
}

// Создаем функцию-фабрику для JWT middleware
export const jwtAuthMiddleware = () => {
  return (req: Request, res: Response, next: NextFunction) => {
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

      // Добавляем userId в объект запроса для дальнейшего использования
      req.userId = userId;
      logger.info(`JWT Auth Middleware: Аутентификация успешна, userId=${userId}`);
      
      next();
    } catch (error) {
      logger.error(`JWT Auth Middleware: Ошибка при проверке токена: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
      return next(new UnauthorizedError('Недействительный токен авторизации'));
    }
  };
};
