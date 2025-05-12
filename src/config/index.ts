import { config } from 'dotenv';
import { validate } from '../validator';
import { AppConfigDto } from './app-config.dto';

config();

type EnvStructure<T> = {
  [key in keyof T]: T[key] extends object ? EnvStructure<T[key]> : string | undefined;
};

const rawConfig: EnvStructure<AppConfigDto> = {
  port: process.env.PORT,
  postgresqlHost: process.env.POSTGRES_HOST,
  postgresqlPort: process.env.POSTGRES_PORT,
  postgresqlUser: process.env.POSTGRES_USER,
  postgresqlPassword: process.env.POSTGRES_PASSWORD,
  postgresqlDatabase: process.env.POSTGRES_DB,
};

export const appConfig = validate(AppConfigDto, rawConfig);
