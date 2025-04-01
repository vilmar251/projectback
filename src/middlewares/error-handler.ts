import { NextFunction, Request, Response } from 'express';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  res.status(500).send({ message: err.message });
};
