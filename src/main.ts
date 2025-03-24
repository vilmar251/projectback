import express, { Request, Response } from 'express';
import { logRoutes } from './bootstrap/log-routes';
import taskRouter from './modules/task/task.router';

const server = express();

server.use(express.json());

const port = 2000;

server.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Ну привет!' });
});

server.use('/task', taskRouter);

logRoutes(server);

server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
