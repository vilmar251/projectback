import { injectable, inject } from 'inversify';
import { CronJob } from 'cron';
import { TYPES } from '../types/types';
import { EmailValidatorService } from '../services/email/email-validator.service';

@injectable()
export class UpdateDisposableDomainsCron {
  constructor(
    @inject(TYPES.EmailValidatorService)
    private readonly emailValidatorService: EmailValidatorService,
  ) {}

  public start(): void {
    const job = new CronJob(
      '0 8 * * *', // Каждый день в 8:00
      async () => {
        try {
          console.log('Начало обновления списка временных почтовых доменов...');
          await this.emailValidatorService.updateDisposableDomains();
          console.log('Список временных почтовых доменов успешно обновлен');
        } catch (error) {
          console.error('Ошибка при обновлении списка временных доменов:', error);
        }
      },
      null,
      true,
      'Europe/Moscow',
    );

    this.emailValidatorService.updateDisposableDomains().catch(console.error);
  }
}
