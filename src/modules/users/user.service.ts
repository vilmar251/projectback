import { compareSync, hashSync } from 'bcrypt';
import { BadRequestError, NotFoundError, UnauthorizedError } from '../../errors';
import logger from '../../logger/pino.logger';
import { LoginDto } from './dto';
import { UserEntity } from '../../database/entities/user.entity';
import { User } from './user.types';

export class UserService {
  async getProfile(id: number): Promise<UserEntity> {
    logger.info('Получение профиля пользователя', { id });
    const user = await UserEntity.findByPk(id);
    if (!user) {
      logger.error('Пользователь не найден', { id });
      throw new NotFoundError('Пользователь не найден');
    }
    return user;
  }

  async create(user: Omit<User, 'id'>) {
    logger.info('Создание нового пользователя', { email: user.email });
    const existingUser = await UserEntity.findOne({ where: { email: user.email } });
    if (existingUser) {
      logger.error('Попытка регистрации с существующим email', { email: user.email });
      throw new BadRequestError('Пользователь с таким email уже существует');
    }
    user.password = hashSync(user.password, 4);
    const result = await UserEntity.create(user as any);
    logger.info('Пользователь успешно создан', { email: result.email });
    return result;
  }

  async findByEmail(email: string) {
    logger.info('Поиск пользователя по email', { email });
    return UserEntity.findOne({ where: { email } });
  }

  async verifyPassword(plainPassword: string, hashedPassword: string) {
    logger.info('Проверка пароля пользователя');
    return compareSync(plainPassword, hashedPassword);
  }

  async login(dto: LoginDto) {
    logger.info('Попытка авторизации', { email: dto.email });
    const user = await UserEntity.findOne({ where: { email: dto.email } });
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

export const userService = new UserService();
