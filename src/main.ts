import express, { Request, Response } from 'express';
import { logRoutes } from './bootstrap/log-routes';
import { LogRequestMiddleware } from './middlewares';
import taskRouter from './modules/task/task.router';
import userController from './modules/users/user.controller';

const server = express();

server.use(express.json());
server.use(LogRequestMiddleware);

const port = 2000;

server.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Ну привет!' });
});

server.use('/task', taskRouter);
server.use('/user', userController);

logRoutes(server);

server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
