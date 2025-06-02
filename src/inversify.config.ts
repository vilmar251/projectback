import { Container } from 'inversify';
import TaskService from './modules/task/task.service';
import UserService from './modules/users/user.service';
import JwtService from './services/jwt/jwt.service';
import { JwtServiceInterface } from './services/jwt/jwt.types';
import RedisService from './services/redis/redis.service';
import { RedisServiceInterface } from './services/redis/redis.types';
import { TYPES } from './types/types';

const container = new Container();

// Регистрация сервисов
container.bind<TaskService>(TYPES.TaskService).to(TaskService).inSingletonScope();
container.bind<UserService>(TYPES.UserService).to(UserService).inSingletonScope();
container.bind<RedisServiceInterface>(TYPES.RedisService).to(RedisService).inSingletonScope();
container.bind<JwtServiceInterface>(TYPES.JwtService).to(JwtService).inSingletonScope();

export { container };
