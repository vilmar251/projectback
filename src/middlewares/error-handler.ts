import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { HttpError } from '../errors/http.error';
import logger from '../logger/pino.logger';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const errorHandler: ErrorRequestHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('ПОЛНАЯ ОШИБКА:', err);

  logger.error('Ошибка обработки запроса', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    body: JSON.stringify(req.body),
    query: JSON.stringify(req.query),
    params: JSON.stringify(req.params),
  });

  if (err instanceof HttpError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  if (process.env.NODE_ENV !== 'production') {
    return res.status(500).json({
      status: 'error',
      message: 'Внутренняя ошибка сервера',
      error: err.message,
      stack: err.stack,
    });
  }

  return res.status(500).json({
    status: 'error',
    message: 'Внутренняя ошибка сервера',
  });
};
