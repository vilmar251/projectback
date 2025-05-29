import { Container } from 'inversify';
import { TYPES } from './types/types';
import TaskService from './modules/task/task.service';
import UserService from './modules/users/user.service';

const container = new Container();

// Регистрация сервисов
container.bind<TaskService>(TYPES.TaskService).to(TaskService).inSingletonScope();
container.bind<UserService>(TYPES.UserService).to(UserService).inSingletonScope();

export { container };
