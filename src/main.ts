import 'reflect-metadata';
import './modules/task/task.controller';
import './modules/users/user.controller';
import './modules/redis-demo/redis-demo.controller';
import express from 'express';
import expressSession from 'express-session';
import { InversifyExpressServer } from 'inversify-express-utils';
import { logRoutes } from './bootstrap/log-routes';
import { appConfig } from './config';
import { connect } from './database/connect';
import { container } from './inversify.config';
import logger from './logger/pino.logger';
import { LogRequestMiddleware } from './middlewares';
import { errorHandler } from './middlewares/error-handler';
import { connectRedis } from './services/redis/redis.connect';

declare module 'express-session' {
  interface SessionData {
    userId: string;
  }
}
const bootstrap = async () => {
  await connect();

  await connectRedis();

  // Создаем сервер Inversify
  const server = new InversifyExpressServer(container);

  // Настраиваем сервер
  server.setConfig((app) => {
    app.use(
      expressSession({
        secret: 'my_secret',
        resave: false,
        saveUninitialized: false,
        name: 'session_id',
        cookie: {
          secure: false,
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000,
        },
      }),
    );

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
