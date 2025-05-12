import { config } from 'dotenv';
import { validate } from '../validator';
import { AppConfigDto } from './app-config.dto';

config();

type EnvStructure<T> = {
  [key in keyof T]: T[key] extends object ? EnvStructure<T[key]> : string | undefined;
};

const rawConfig: EnvStructure<AppConfigDto> = {
  port: process.env.PORT,
  postgresqlHost: process.env.POSTGRES_HOST || 'localhost',
  postgresqlPort: process.env.POSTGRES_PORT || '5432',
};

export const appConfig = validate(AppConfigDto, rawConfig);
