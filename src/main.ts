import 'reflect-metadata';
import express from 'express';
import { logRoutes } from './bootstrap/log-routes';
import logger from './logger/pino.logger';
import { LogRequestMiddleware } from './middlewares';
import { ErrorHandler } from './middlewares/error-handler';
import taskController from './modules/task/task.controller';
import userController from './modules/users/user.controller';

const server = express();

server.use(express.json());

server.use(LogRequestMiddleware);

const port = 2000;

server.use('/task', taskController);
server.use('/user', userController);

server.use(ErrorHandler);
logRoutes(server);

server.listen(port, () => {
  logger.info(`Server started on port ${port}`);
});
