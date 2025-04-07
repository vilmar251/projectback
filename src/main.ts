import express, { Request, Response } from 'express';
import { logRoutes } from './bootstrap/log-routes';
import logger from './logger/pino.logger';
import { LogRequestMiddleware } from './middlewares';
import { ErrorHandler } from './middlewares/error-handler';
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

server.use(ErrorHandler);
logRoutes(server);

server.listen(port, () => {
  logger.info(`Server started on port ${port}`);
});
