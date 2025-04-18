import 'reflect-metadata';
import express from 'express';
import { logRoutes } from './bootstrap/log-routes';
import { appConfig } from './config';
import logger from './logger/pino.logger';
import { LogRequestMiddleware } from './middlewares';
import { ErrorHandler } from './middlewares/error-handler';
import taskController from './modules/task/task.controller';
import userController from './modules/users/user.controller';

const server = express();

server.use(express.json());

server.use(LogRequestMiddleware);

server.use('/task', taskController);
server.use('/user', userController);

server.use(ErrorHandler);
logRoutes(server);

server.listen(appConfig.port, () => {
  logger.info(`Server started on port ${appConfig.port}`);
});
