import { Container } from 'inversify';
import { TYPES } from './types/types';
import TaskService from './modules/task/task.service';
import UserService from './modules/users/user.service';
import RedisService from './services/redis/redis.service';
import { RedisServiceInterface } from './services/redis/redis.types';

const container = new Container();

// Регистрация сервисов
container.bind<TaskService>(TYPES.TaskService).to(TaskService).inSingletonScope();
container.bind<UserService>(TYPES.UserService).to(UserService).inSingletonScope();
container.bind<RedisServiceInterface>(TYPES.RedisService).to(RedisService).inSingletonScope();

export { container };
