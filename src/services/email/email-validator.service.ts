import axios from 'axios';
import { inject, injectable } from 'inversify';
import logger from '../../logger/pino.logger';
import { TYPES } from '../../types/types';
import RedisService from '../redis/redis.service';

export interface IEmailValidatorService {
  isDisposableEmail(email: string): Promise<boolean>;
  updateDisposableDomains(): Promise<void>;
}

@injectable()
export class EmailValidatorService implements IEmailValidatorService {
  private readonly DOMAINS_KEY = 'disposable-email-domains';
  private readonly DOMAINS_URL =
    'https://raw.githubusercontent.com/disposable/disposable-email-domains/master/domains.txt';
  private readonly TTL_24H = 60 * 60 * 24; // 24 часа в секундах

  constructor(@inject(TYPES.RedisService) private readonly redisService: RedisService) {}

  public async isDisposableEmail(email: string): Promise<boolean> {
    const domain = this.extractDomain(email);
    if (!domain) return false;

    const exists = await this.redisService.sismember(this.DOMAINS_KEY, domain.toLowerCase());
    return exists === 1;
  }

  public async updateDisposableDomains(): Promise<void> {
    try {
      logger.info('Начало загрузки списка временных почтовых доменов...');
      const response = await axios.get(this.DOMAINS_URL, { timeout: 10000 });

      if (response.status !== 200) {
        throw new Error(`Ошибка при загрузке списка: ${response.status} ${response.statusText}`);
      }

      const domains = response.data
        .split('\n')
        .map((domain: string) => domain.trim().toLowerCase())
        .filter((domain: string) => domain && !domain.startsWith('#') && domain.includes('.'));

      logger.info(`Загружено ${domains.length} временных почтовых доменов`);

      if (domains.length === 0) {
        logger.warn('Список временных доменов пуст');
        return;
      }

      await this.redisService.del(this.DOMAINS_KEY);

      const BATCH_SIZE = 1000;
      for (let i = 0; i < domains.length; i += BATCH_SIZE) {
        const batch = domains.slice(i, i + BATCH_SIZE);
        await this.redisService.sadd(this.DOMAINS_KEY, ...batch);
      }

      await this.redisService.expire(this.DOMAINS_KEY, this.TTL_24H);

      logger.info('Список временных почтовых доменов успешно обновлен в Redis');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
      logger.error('Ошибка при обновлении списка временных доменов:', { error: errorMessage });
      throw new Error(`Не удалось обновить список временных почтовых доменов: ${errorMessage}`);
    }
  }

  private extractDomain(email: string): string | null {
    const match = email.toLowerCase().match(/@([^@\s]+)$/);
    return match ? match[1] : null;
  }
}
