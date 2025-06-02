import { compareSync, hashSync } from 'bcrypt';
import { inject, injectable } from 'inversify';
import { UserEntity } from '../../database/entities/user.entity';
import { BadRequestError, NotFoundError, UnauthorizedError } from '../../errors';
import logger from '../../logger/pino.logger';
import { TYPES } from '../../types/types';
import { JwtServiceInterface } from '../../services/jwt/jwt.types';
import { LoginDto } from './dto';
import { User } from './user.types';

@injectable()
export default class UserService {
  constructor(
    @inject(TYPES.JwtService) private readonly jwtService: JwtServiceInterface
  ) {}
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
    try {
      logger.info('Создание нового пользователя', { email: user.email, userData: JSON.stringify(user) });

      const existingUser = await UserEntity.findOne({ where: { email: user.email } });
      if (existingUser) {
        logger.error('Попытка регистрации с существующим email', { email: user.email });
        throw new BadRequestError('Пользователь с таким email уже существует');
      }

      user.password = hashSync(user.password, 4);

      logger.info('Попытка создания пользователя в базе данных', { email: user.email });
      const result = await UserEntity.create(user as Omit<User, 'id'>);

      logger.info('Пользователь успешно создан', { email: result.email, userId: result.id });
      return result;
    } catch (error: unknown) {
      logger.error('Ошибка при создании пользователя', {
        email: user.email,
        error: (error as Error).message,
        stack: (error as Error).stack,
      });
      throw error;
    }
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
    try {
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

      // Генерируем JWT токен
      const token = this.jwtService.generateToken({ userId: user.id });

      logger.info('Авторизация успешна, токен сгенерирован', { email: user.email, userId: user.id });
      return {
        user,
        token
      };
    } catch (error: unknown) {
      logger.error('Ошибка при авторизации', {
        email: dto.email,
        error: (error as Error).message,
        stack: (error as Error).stack,
      });
      throw error;
    }
  }
}
