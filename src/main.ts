import 'reflect-metadata';
import './modules/task/task.controller';
import './modules/users/user.controller';
import './modules/redis-demo/redis-demo.controller';
import express from 'express';
import { InversifyExpressServer } from 'inversify-express-utils';
import { logRoutes } from './bootstrap/log-routes';
import { appConfig } from './config';
import { connect } from './database/connect';
import { container } from './inversify.config';
import logger from './logger/pino.logger';
import { LogRequestMiddleware } from './middlewares';
import { errorHandler } from './middlewares/error-handler';
import { connectRedis } from './services/redis/redis.connect';


const bootstrap = async () => {
  await connect();

  await connectRedis();

  // Создаем сервер Inversify
  const server = new InversifyExpressServer(container);

  // Настраиваем сервер
  server.setConfig((app) => {
    app.use(express.json());
    app.use(LogRequestMiddleware);
  });

  server.setErrorConfig((app) => {
    app.use(errorHandler);
  });

  const app = server.build();

  logRoutes(app);

  app.listen(appConfig.port, () => {
    logger.info(`Server started on port ${appConfig.port}`);
  });
};
bootstrap();
