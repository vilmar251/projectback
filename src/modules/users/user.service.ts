import { compareSync, hashSync } from 'bcrypt';
import { BadRequestError, NotFoundError, UnauthorizedError } from '../../errors';
import logger from '../../logger/pino.logger';
import { LoginDto } from './dto';
import { UserRepository } from './user.repository';
import { User } from './user.types';

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  getProfile(id: string): User {
    logger.info('Получение профиля пользователя', { id });
    const user = this.userRepository.findById(id);
    if (!user) {
      logger.error('Пользователь не найден', { id });
      throw new NotFoundError('Пользователь не найден');
    }
    return user;
  }

  create(user: Omit<User, 'id'>) {
    logger.info('Создание нового пользователя', { email: user.email });

    // Проверяем существование пользователя с таким email
    const existingUser = this.userRepository.findByEmail(user.email);
    if (existingUser) {
      logger.error('Попытка регистрации с существующим email', { email: user.email });
      throw new BadRequestError('Пользователь с таким email уже существует');
    }

    user.password = hashSync(user.password, 4);
    const result = this.userRepository.save(user);
    logger.info('Пользователь успешно создан', { email: result.email });
    return result;
  }

  async findByEmail(email: string) {
    logger.info('Поиск пользователя по email', { email });
    return this.userRepository.findByEmail(email);
  }

  async verifyPassword(plainPassword: string, hashedPassword: string) {
    logger.info('Проверка пароля пользователя');
    return compareSync(plainPassword, hashedPassword);
  }

  login(dto: LoginDto) {
    logger.info('Попытка авторизации', { email: dto.email });

    const user = this.userRepository.findByEmail(dto.email);
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
  }
}

// Создал экземпляр сервиса с репозиторием
export const userService = new UserService(new UserRepository());
