import dayjs from 'dayjs';
import { NextFunction, Request, Response } from 'express';

export const LogRequestMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const date = dayjs().format('YYYY-MM-DD HH:mm:ss');

  const log = {
    params: req.params,
    query: req.query,
    body: req.body,
  };

  console.log(`[${date}] Пришёл запрос: ${req.method} ${req.originalUrl}`, log);

  next();
};
