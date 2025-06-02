import { TokenPair } from '../../modules/users/user.types';

export interface JwtServiceInterface {
  generateToken(payload: Record<string, any>): string;

  generateTokenPair(userId: number, role: string): Promise<TokenPair>;

  refreshTokenPair(refreshToken: string): Promise<TokenPair | null>;

  verifyToken(token: string): Record<string, any> | null;

  extractUserIdFromToken(token: string): number | null;

  extractRoleFromToken(token: string): string | null;

  removeRefreshToken(refreshToken: string): Promise<boolean>;
}
