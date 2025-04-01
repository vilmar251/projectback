import logger from '../../logger/pino.logger';
import { userRepository } from './user.repository';

export const userService = {
  getProfile(id: number) {
    logger.info(`Чтение профиля по id = ${id}`);
    return {
      id: id,
      name: 'example',
    };
  },
  create(user: any) {
    logger.info('Регистрация нового пользователя ');

    const result = userRepository.save(user);
  },
};
