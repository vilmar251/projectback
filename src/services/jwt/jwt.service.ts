import { inject, injectable } from 'inversify';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { appConfig } from '../../config';
import logger from '../../logger/pino.logger';
import { RefreshTokenPayload, TokenPair } from '../../modules/users/user.types';
import { TYPES } from '../../types/types';
import { RedisServiceInterface } from '../redis/redis.types';
import { JwtServiceInterface } from './jwt.types';

@injectable()
export default class JwtService implements JwtServiceInterface {
  // Префикс для ключей refresh токенов в Redis
  private readonly REFRESH_TOKEN_PREFIX = 'refresh_token:';
  // Время жизни refresh токена (30 дней)
  private readonly REFRESH_TOKEN_TTL = 60 * 60 * 24 * 30; // 30 дней в секундах
  // Время жизни access токена (1 день)
  private readonly ACCESS_TOKEN_TTL = '24h';

  constructor(@inject(TYPES.RedisService) private redisService: RedisServiceInterface) {}
  generateToken(payload: Record<string, string | number | boolean>): string {
    try {
      return jwt.sign(payload, appConfig.jwtSecret, { expiresIn: this.ACCESS_TOKEN_TTL });
    } catch (error) {
      logger.error('Error generating JWT token:', error);
      throw error;
    }
  }

  async generateTokenPair(userId: number, role: string): Promise<TokenPair> {
    try {
      const tokenId = uuidv4();

      const accessToken = this.generateToken({ userId, role });

      const refreshToken = jwt.sign({ userId, tokenId } as RefreshTokenPayload, appConfig.jwtSecret, {
        expiresIn: '30d',
      });

      const refreshTokenKey = `${this.REFRESH_TOKEN_PREFIX}${tokenId}`;
      await this.redisService.set(refreshTokenKey, JSON.stringify({ userId, tokenId }), this.REFRESH_TOKEN_TTL);

      logger.info(`Сгенерирована пара токенов для пользователя ${userId}`);

      return { accessToken, refreshToken };
    } catch (error) {
      logger.error(
        `Ошибка при генерации пары токенов: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`,
      );
      throw error;
    }
  }

  async refreshTokenPair(refreshToken: string): Promise<TokenPair | null> {
    try {
      const payload = this.verifyToken(refreshToken) as RefreshTokenPayload | null;

      if (!payload || !payload.userId || !payload.tokenId) {
        logger.warn('Невалидный refresh токен');
        return null;
      }

      const refreshTokenKey = `${this.REFRESH_TOKEN_PREFIX}${payload.tokenId}`;
      const storedToken = await this.redisService.get(refreshTokenKey);

      if (!storedToken) {
        logger.warn(`Refresh токен не найден в Redis: ${refreshTokenKey}`);
        return null;
      }

      await this.redisService.del(refreshTokenKey);

      const role = 'user';

      return await this.generateTokenPair(payload.userId, role);
    } catch (error) {
      logger.error(`Ошибка при обновлении токенов: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
      return null;
    }
  }

  async removeRefreshToken(refreshToken: string): Promise<boolean> {
    try {
      const payload = this.verifyToken(refreshToken) as RefreshTokenPayload | null;

      if (!payload || !payload.tokenId) {
        logger.warn('Невалидный refresh токен при попытке удаления');
        return false;
      }

      const refreshTokenKey = `${this.REFRESH_TOKEN_PREFIX}${payload.tokenId}`;
      await this.redisService.del(refreshTokenKey);

      logger.info(`Refresh токен удален: ${refreshTokenKey}`);
      return true;
    } catch (error) {
      logger.error(
        `Ошибка при удалении refresh токена: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`,
      );
      return false;
    }
  }

  verifyToken(token: string): Record<string, string | number | boolean> | null {
    try {
      return jwt.verify(token, appConfig.jwtSecret) as Record<string, string | number | boolean>;
    } catch (error) {
      logger.error('Error verifying JWT token:', error);
      return null;
    }
  }

  extractUserIdFromToken(token: string): number | null {
    const payload = this.verifyToken(token);
    if (!payload || !payload.userId) {
      return null;
    }
    return Number(payload.userId);
  }

  extractRoleFromToken(token: string): string | null {
    const payload = this.verifyToken(token);
    if (!payload || !payload.role) {
      return null;
    }
    return payload.role as string;
  }
}
