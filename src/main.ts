import 'reflect-metadata';
import express from 'express';
import expressSession from 'express-session';
import { logRoutes } from './bootstrap/log-routes';
import { appConfig } from './config';
import logger from './logger/pino.logger';
import { LogRequestMiddleware } from './middlewares';
import { ErrorHandler } from './middlewares/error-handler';
import { taskController } from './modules/task/task.module';
import userController from './modules/users/user.controller';

const server = express();

server.use(
  expressSession({
    secret: 'my_secret',
    resave: false,
    saveUninitialized: false,
    name: 'session_id',
  }),
);

server.use(express.json());

server.use(LogRequestMiddleware);

server.use('/task', taskController.router);
server.use('/user', userController.router);

server.use(ErrorHandler);
logRoutes(server);

server.listen(appConfig.port, () => {
  logger.info(`Server started on port ${appConfig.port}`);
});
