import { injectable } from 'inversify';
import jwt from 'jsonwebtoken';
import { appConfig } from '../../config';
import logger from '../../logger/pino.logger';
import { JwtServiceInterface } from './jwt.types';

@injectable()
export default class JwtService implements JwtServiceInterface {
  generateToken(payload: Record<string, any>): string {
    try {
      return jwt.sign(payload, appConfig.jwtSecret, { expiresIn: '24h' });
    } catch (error) {
      logger.error('Error generating JWT token:', error);
      throw error;
    }
  }

  verifyToken(token: string): Record<string, any> | null {
    try {
      return jwt.verify(token, appConfig.jwtSecret) as Record<string, any>;
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
}
