import { compareSync, hashSync } from 'bcrypt';
import logger from '../../logger/pino.logger';
import { LoginDto } from './dto';
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

    user.password = hashSync(user.password, 4);

    const result = userRepository.save(user);

    return result;
  },
  login(dto: LoginDto) {
    logger.info(`Логин для ${dto.email}`);

    const user = userRepository.findByEmail(dto.email);
    if (!user) {
      throw Error('User not found');
    }

    if (!compareSync(dto.password, user.password)) {
      throw Error('Incorrect password');
    }

    return user;
  },
};
