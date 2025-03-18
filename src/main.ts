import express, { Request, Response } from 'express';
import { RateLimiter } from './middleware/rate-limiter';

const server = express();

const port = 2000;

server.use(RateLimiter);
server.get('/task/:id', (request: Request, res: Response) => {
  const id = request.params.id;
  res.json({ message: `Вы запросили id=${id}` });
});
server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
