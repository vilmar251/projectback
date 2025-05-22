import { Sequelize } from 'sequelize-typescript';
import { appConfig } from '../config';
import logger from '../logger/pino.logger';
import { TaskEntity } from './entities/task.entity';
import { UserEntity } from './entities/user.entity';

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
      define: {
        timestamps: true,
        underscored: true,
      },
    });

    await connection.authenticate();
    await connection.sync({ alter: true });
    logger.info('Successfully connected to the database');
  } catch (error) {
    logger.error('Failed to connect to the database:', error);
    throw error;
  }
};
