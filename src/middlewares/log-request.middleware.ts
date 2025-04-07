import { NextFunction, Request, Response } from 'express';
import logger from '../logger/pino.logger';

export const LogRequestMiddleware = (req: Request, res: Response, next: NextFunction) => {
  logger.info(`Пришел ${req.method} запрос: ${req.originalUrl}`);

  next();
};
