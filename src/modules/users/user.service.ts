import logger from '../../logger/pino.logger';
import { userRepository } from './user.repository';
import { User } from './user.types';

export const userService = {
  getProfile(id: number) {
    logger.info(`Чтение профиля по id = ${id}`);
    return {
      id: id,
      name: 'example',
    };
  },
  create(user: Omit<User, 'id'>) {
    logger.info('Регистрация нового пользователя ');

    const result = userRepository.save(user);
  },
};
