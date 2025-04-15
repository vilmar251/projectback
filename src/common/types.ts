import { NextFunction, Request, Response } from 'express';

export type Middleware = (req: Request, res: Response, next: NextFunction) => void;

export type Route = {
  path: string;
  method?: 'get' | 'post' | 'put' | 'delete';
  handler: (req: Request, res: Response, next: NextFunction) => void;
  middlewares?: Middleware[];
};
