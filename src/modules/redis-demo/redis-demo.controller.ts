import { Request, Response } from 'express';
import { inject } from 'inversify';
import { controller, httpGet, httpPost, request, response } from 'inversify-express-utils';
import { InversifyController } from '../../common/inversify.controller';
import logger from '../../logger/pino.logger';
import { RedisServiceInterface } from '../../services/redis/redis.types';
import { TYPES } from '../../types/types';

@controller('/redis-demo')
export default class RedisDemoController extends InversifyController {
  constructor(@inject(TYPES.RedisService) private readonly redisService: RedisServiceInterface) {
    super();
  }

  @httpPost('/set')
  private async setValue(@request() req: Request, @response() res: Response): Promise<void> {
    try {
      const { key, value, expireSeconds } = req.body;

      if (!key || !value) {
        res.status(400).json({ error: 'Key and value are required' });
        return;
      }

      // Преобразуем объекты в JSON-строку перед сохранением
      const valueToStore = typeof value === 'object' ? JSON.stringify(value) : value;

      await this.redisService.set(key, valueToStore, expireSeconds);

      logger.info(`Set Redis key: ${key} with value: ${value}`);
      res.status(200).json({ success: true, message: `Value set for key: ${key}` });
    } catch (error) {
      logger.error('Error setting Redis value:', error);
      res.status(500).json({ error: 'Failed to set value in Redis' });
    }
  }

  @httpGet('/get/:key')
  private async getValue(@request() req: Request, @response() res: Response): Promise<void> {
    try {
      const { key } = req.params;

      if (!key) {
        res.status(400).json({ error: 'Key is required' });
        return;
      }

      const value = await this.redisService.get(key);

      if (value === null) {
        res.status(404).json({ error: `Key not found: ${key}` });
        return;
      }

      // Пытаемся распарсить значение как JSON, если это возможно
      let parsedValue = value;
      try {
        if (value.startsWith('{') || value.startsWith('[')) {
          parsedValue = JSON.parse(value);
        }
      } catch (e) {
        // Если не удалось распарсить, оставляем как есть
        logger.warn(`Could not parse value as JSON for key: ${key}`);
      }

      logger.info(`Retrieved Redis key: ${key}`);
      res.status(200).json({ key, value: parsedValue });
    } catch (error) {
      logger.error('Error getting Redis value:', error);
      res.status(500).json({ error: 'Failed to get value from Redis' });
    }
  }

  @httpGet('/exists/:key')
  private async keyExists(@request() req: Request, @response() res: Response): Promise<void> {
    try {
      const { key } = req.params;

      if (!key) {
        res.status(400).json({ error: 'Key is required' });
        return;
      }

      const exists = await this.redisService.exists(key);

      logger.info(`Checked if Redis key exists: ${key}, result: ${exists}`);
      res.status(200).json({ key, exists });
    } catch (error) {
      logger.error('Error checking if Redis key exists:', error);
      res.status(500).json({ error: 'Failed to check if key exists in Redis' });
    }
  }

  @httpPost('/delete/:key')
  private async deleteKey(@request() req: Request, @response() res: Response): Promise<void> {
    try {
      const { key } = req.params;

      if (!key) {
        res.status(400).json({ error: 'Key is required' });
        return;
      }

      await this.redisService.del(key);

      logger.info(`Deleted Redis key: ${key}`);
      res.status(200).json({ success: true, message: `Key deleted: ${key}` });
    } catch (error) {
      logger.error('Error deleting Redis key:', error);
      res.status(500).json({ error: 'Failed to delete key from Redis' });
    }
  }
}
