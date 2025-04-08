import { config } from 'dotenv';

config();

export const appConfig = {
  port: Number(process.env.PORT),
};
