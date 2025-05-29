import { Sequelize } from 'sequelize-typescript';
import { appConfig } from '../config';
import logger from '../logger/pino.logger';
import { TaskEntity, UserEntity } from './entities';

export const connect = async () => {
  try {
    logger.info('Attempting to connect to the database...');
    const connection = new Sequelize({
      dialect: 'postgres',
      logging: false,
      host: appConfig.postgresqlHost,
      port: appConfig.postgresqlPort,
      username: appConfig.postgresqlUser,
      password: appConfig.postgresqlPassword,
      database: appConfig.postgresqlDatabase,
      models: [UserEntity, TaskEntity],
    });

    await connection.authenticate();
    await connection.sync({ alter: false });
    logger.info('Successfully connected to the database');
  } catch (error) {
    logger.error('Failed to connect to the database:', error);
    throw error;
  }
};
