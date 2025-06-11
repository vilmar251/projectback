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
    return this.client.get(key);
  }

  async set(key: string, value: string, expireSeconds?: number): Promise<void> {
    if (expireSeconds) {
      await this.client.setex(key, expireSeconds, value);
    } else {
      await this.client.set(key, value);
    }
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  async exists(key: string): Promise<boolean> {
    const result = await this.client.exists(key);
    return result === 1;
  }

  async flushDb(): Promise<void> {
    await this.client.flushdb();
  }

  async keys(pattern: string): Promise<string[]> {
    return this.client.keys(pattern);
  }

  async sadd(key: string, ...members: string[]): Promise<number> {
    return this.client.sadd(key, ...members);
  }

  async sismember(key: string, member: string): Promise<number> {
    return this.client.sismember(key, member);
  }

  async smembers(key: string): Promise<string[]> {
    return this.client.smembers(key);
  }

  async srem(key: string, ...members: string[]): Promise<number> {
    return this.client.srem(key, ...members);
  }

  async expire(key: string, seconds: number): Promise<number> {
    return this.client.expire(key, seconds);
  }
}
