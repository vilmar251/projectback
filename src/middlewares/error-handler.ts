import { NextFunction, Request, Response } from 'express';

export const ErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  res.status(500).send({ message: err.message });
};
