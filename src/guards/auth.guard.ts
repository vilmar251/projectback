import { NextFunction, Request, Response } from 'express';

export const AuthGuard = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.userId) {
    throw new Error('Unauthorized');
  }

  next();
};
