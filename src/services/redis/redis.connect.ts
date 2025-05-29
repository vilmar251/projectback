import { appConfig } from '../../config';
import logger from '../../logger/pino.logger';
import Redis from 'ioredis';

let redisClient: Redis | null = null;

export const connectRedis = async (): Promise<Redis> => {
  try {
    logger.info('Attempting to connect to Redis...');
    
    if (redisClient) {
      return redisClient;
    }
    
    redisClient = new Redis({
      host: appConfig.redisHost,
      port: appConfig.redisPort,
      password: appConfig.redisPassword || undefined,
      db: appConfig.redisDb,
    });

    // Проверяем соединение
    await redisClient.ping();
    logger.info('Successfully connected to Redis');
    
    return redisClient;
  } catch (error) {
    logger.error('Failed to connect to Redis:', error);
    throw error;
  }
};

export const getRedisClient = (): Redis => {
  if (!redisClient) {
    throw new Error('Redis client not initialized. Call connectRedis() first.');
  }
  return redisClient;
};

export const closeRedisConnection = async (): Promise<void> => {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
    logger.info('Redis connection closed');
  }
};
