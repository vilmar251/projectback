import { Sequelize } from 'sequelize-typescript';
import { appConfig } from '../config';
import logger from '../logger/pino.logger';

export const connect = async () => {
  const connection = new Sequelize({
    dialect: 'postgres',
    logging: false,
    host: appConfig.postgresqlHost,
    port: appConfig.postgresqlPort,
    username: 'postgres',
    password: 'postgrespassword',
    database: 'backend',
  });

  await connection.authenticate();

  logger.info('Successfully connected to the database');
};
