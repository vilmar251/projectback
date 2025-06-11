import { Container } from 'inversify';
import TaskService from './modules/task/task.service';
import UserService from './modules/users/user.service';
import JwtService from './services/jwt/jwt.service';
import { JwtServiceInterface } from './services/jwt/jwt.types';
import RedisService from './services/redis/redis.service';
import { RedisServiceInterface } from './services/redis/redis.types';
import { TYPES } from './types/types';
import { EmailValidatorService, IEmailValidatorService } from './services/email/email-validator.service';
import { UpdateDisposableDomainsCron } from './cron/update-disposable-domains.cron';

const container = new Container();

// Регистрация сервисов
container.bind<TaskService>(TYPES.TaskService).to(TaskService).inSingletonScope();
container.bind<UserService>(TYPES.UserService).to(UserService).inSingletonScope();
container.bind<RedisServiceInterface>(TYPES.RedisService).to(RedisService).inSingletonScope();
container.bind<JwtServiceInterface>(TYPES.JwtService).to(JwtService).inSingletonScope();
container.bind<IEmailValidatorService>(TYPES.EmailValidatorService).to(EmailValidatorService).inSingletonScope();
container.bind<UpdateDisposableDomainsCron>(TYPES.UpdateDisposableDomainsCron).to(UpdateDisposableDomainsCron).inSingletonScope();

export { container };
