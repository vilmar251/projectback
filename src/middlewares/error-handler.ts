import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../errors/http.error';
import logger from '../logger/pino.logger';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error('Ошибка обработки запроса', {
    error: err.message,
    path: req.path,
    method: req.method,
  });

  if (err instanceof HttpError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  // Обработка неизвестных ошибок
  return res.status(500).json({
    status: 'error',
    message: 'Внутренняя ошибка сервера',
  });
};
