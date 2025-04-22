import { config } from 'dotenv';
import { validate } from '../validator';
import { AppConfigDto } from './app-config.dto';

config();

type EnvStructure<T> = {
  [key in keyof T]: T[key] extends object ? EnvStructure<T[key]> : string | undefined;
};

const rawConfig: EnvStructure<AppConfigDto> = {
  port: process.env.PORT,
};

export const appConfig = validate(AppConfigDto, rawConfig);
