import UserController from './user.controller';
import UserService from './user.service';

// Этот файл больше не нужен, так как мы используем Inversify для внедрения зависимостей
// Оставляем для обратной совместимости
const service = new UserService();
export const userController = new UserController(service);
