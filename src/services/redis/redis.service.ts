import { injectable } from 'inversify';
import Redis from 'ioredis';
import { appConfig } from '../../config';
import logger from '../../logger/pino.logger';
import { RedisServiceInterface } from './redis.types';

@injectable()
export default class RedisService implements RedisServiceInterface {
  private readonly client: Redis;

  constructor() {
    this.client = new Redis({
      host: appConfig.redisHost,
      port: appConfig.redisPort,
      password: appConfig.redisPassword || undefined,
      db: appConfig.redisDb,
    });

    this.client.on('connect', () => {
      logger.info('Successfully connected to Redis');
    });

    this.client.on('error', (error) => {
      logger.error('Redis connection error:', error);
    });
  }

  async get(key: string): Promise<string | null> {
    try {
      return await this.client.get(key);
    } catch (error) {
      logger.error(`Error getting key ${key} from Redis:`, error);
      throw error;
    }
  }

  async set(key: string, value: string, expireSeconds?: number): Promise<void> {
    try {
      if (expireSeconds) {
        await this.client.set(key, value, 'EX', expireSeconds);
      } else {
        await this.client.set(key, value);
      }
    } catch (error) {
      logger.error(`Error setting key ${key} in Redis:`, error);
      throw error;
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.client.del(key);
    } catch (error) {
      logger.error(`Error deleting key ${key} from Redis:`, error);
      throw error;
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      logger.error(`Error checking if key ${key} exists in Redis:`, error);
      throw error;
    }
  }

  async flushDb(): Promise<void> {
    try {
      await this.client.flushdb();
    } catch (error) {
      logger.error('Error flushing Redis database:', error);
      throw error;
    }
  }

  async keys(pattern: string): Promise<string[]> {
    try {
      return await this.client.keys(pattern);
    } catch (error) {
      logger.error(`Error getting keys with pattern ${pattern} from Redis:`, error);
      throw error;
    }
  }
}
