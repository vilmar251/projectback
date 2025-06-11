import 'reflect-metadata';
import './modules/task/task.controller';
import './modules/users/user.controller';
import './modules/redis-demo/redis-demo.controller';
import express from 'express';
import { InversifyExpressServer } from 'inversify-express-utils';
import { logRoutes } from './bootstrap/log-routes';
import { appConfig } from './config';
import { UpdateDisposableDomainsCron } from './cron/update-disposable-domains.cron';
import { connect } from './database/connect';
import { container } from './inversify.config';
import logger from './logger/pino.logger';
import { LogRequestMiddleware } from './middlewares';
import { errorHandler } from './middlewares/error-handler';
import { connectRedis } from './services/redis/redis.connect';
import { TYPES } from './types/types';

const bootstrap = async () => {
  await connect();

  await connectRedis();

  // Запускаю крон-задачу для обновления списка временных почтовых доменов
  const updateDomainsCron = container.get<UpdateDisposableDomainsCron>(TYPES.UpdateDisposableDomainsCron);
  updateDomainsCron.start();

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
