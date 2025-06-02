import { compareSync, hashSync } from 'bcrypt';
import { inject, injectable } from 'inversify';
import { UserEntity, UserRole } from '../../database/entities/user.entity';
import { BadRequestError, NotFoundError, UnauthorizedError } from '../../errors';
import logger from '../../logger/pino.logger';
import { JwtServiceInterface } from '../../services/jwt/jwt.types';
import { TYPES } from '../../types/types';
import { LoginDto } from './dto';
import { TokenPair } from './user.types';

@injectable()
export default class UserService {
  constructor(@inject(TYPES.JwtService) private readonly jwtService: JwtServiceInterface) {}
  async getProfile(id: number): Promise<UserEntity> {
    logger.info('Получение профиля пользователя', { id });
    const user = await UserEntity.findByPk(id);
    if (!user) {
      logger.error('Пользователь не найден', { id });
      throw new NotFoundError('Пользователь не найден');
    }
    return user;
  }

  async create(userData: { email: string; password: string; role?: UserRole }) {
    try {
      logger.info('Создание нового пользователя', { email: userData.email, userData: JSON.stringify(userData) });

      const existingUser = await UserEntity.findOne({ where: { email: userData.email } });
      if (existingUser) {
        logger.error('Попытка регистрации с существующим email', { email: userData.email });
        throw new BadRequestError('Пользователь с таким email уже существует');
      }

      userData.password = hashSync(userData.password, 4);

      if (!userData.role) {
        userData.role = UserRole.USER;
      }

      logger.info('Попытка создания пользователя в базе данных', { email: userData.email, role: userData.role });
      const result = await UserEntity.create(userData);

      logger.info('Пользователь успешно создан', { email: result.email, userId: result.id, role: result.role });
      return result;
    } catch (error: unknown) {
      logger.error('Ошибка при создании пользователя', {
        email: userData.email,
        error: (error as Error).message,
        stack: (error as Error).stack,
      });
      throw error;
    }
  }

  async findByEmail(email: string) {
    logger.info('Поиск пользователя по email', { email });
    const user = await UserEntity.findOne({ where: { email } });
    logger.info('Результат поиска пользователя', { found: !!user, user: user ? JSON.stringify(user) : 'null' });
    return user;
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

      const tokens = await this.jwtService.generateTokenPair(user.id, user.role);

      logger.info('Авторизация успешна, токены сгенерированы', { email: user.email, userId: user.id });
      return {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
        ...tokens,
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

  async refreshTokens(refreshToken: string): Promise<TokenPair | null> {
    try {
      logger.info('Запрос на обновление токенов');
      return await this.jwtService.refreshTokenPair(refreshToken);
    } catch (error: unknown) {
      logger.error('Ошибка при обновлении токенов', {
        error: (error as Error).message,
        stack: (error as Error).stack,
      });
      throw error;
    }
  }

  async logout(refreshToken: string): Promise<boolean> {
    try {
      logger.info('Запрос на выход из системы');
      return await this.jwtService.removeRefreshToken(refreshToken);
    } catch (error: unknown) {
      logger.error('Ошибка при выходе из системы', {
        error: (error as Error).message,
        stack: (error as Error).stack,
      });
      throw error;
    }
  }

  async getAllUsers(): Promise<UserEntity[]> {
    try {
      logger.info('Получение списка всех пользователей');
      const users: UserEntity[] = await UserEntity.findAll();
      logger.info(`Получено ${users.length} пользователей`);
      return users;
    } catch (error: unknown) {
      logger.error('Ошибка при получении списка пользователей', {
        error: (error as Error).message,
        stack: (error as Error).stack,
      });
      throw error;
    }
  }
}
