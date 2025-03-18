import dayjs from 'dayjs';
import { NextFunction, Request, Response } from 'express';

const storage = {
  count: 0,
  date: dayjs().startOf('minute'),
};

const MAX_REQUESTS_PER_MINUTE = 10;

export const RateLimiter = (req: Request, res: Response, next: NextFunction) => {
  console.log({
    count: storage.count,
    date: storage.date.toISOString(),
  });

  storage.count++;

  const now = dayjs().startOf('minute');

  if (now.isSame(storage.date)) {
    if (storage.count > MAX_REQUESTS_PER_MINUTE) {
      res.status(429).json({ error: 'Too Many Requests' });
      return;
    }
  } else {
    storage.count = 1;
    storage.date = now;
  }

  next();
};
