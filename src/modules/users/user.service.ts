import { compareSync, hashSync } from 'bcrypt';
import logger from '../../logger/pino.logger';
import { LoginDto } from './dto';
import { userRepository } from './user.repository';
import { User } from './user.types';
import { NotFoundError, UnauthorizedError } from '../../errors/http.error';

export const userService = {
  getProfile(id: number) {
    logger.info('Получение профиля пользователя', { id });
    return {
      id: id,
      name: 'example',
    };
  },
  create(user: Omit<User, 'id'>) {
    logger.info('Создание нового пользователя', { email: user.email });
    user.password = hashSync(user.password, 4);
    const result = userRepository.save(user);
    logger.info('Пользователь создан', { email: result.email });
    return result;
  },
  async findByEmail(email: string) {
    logger.info('Поиск пользователя по email', { email });
    return userRepository.findByEmail(email);
  },
  async verifyPassword(plainPassword: string, hashedPassword: string) {
    logger.info('Проверка пароля пользователя');
    return compareSync(plainPassword, hashedPassword);
  },
  login(dto: LoginDto) {
    logger.info('Попытка авторизации', { email: dto.email });

    const user = userRepository.findByEmail(dto.email);
    if (!user) {
      logger.error('Пользователь не найден', { email: dto.email });
      throw new NotFoundError('Пользователь не найден');
    }

    if (!compareSync(dto.password, user.password)) {
      logger.error('Неверный пароль', { email: dto.email });
      throw new UnauthorizedError('Неверный пароль');
    }

    logger.info('Авторизация успешна', { email: user.email });
    return user;
  },
};
