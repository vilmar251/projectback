import { UserRole } from '../../database/entities/user.entity';

export type User = {
  id: number;
  email: string;
  password: string;
  role: UserRole;
};

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenPayload {
  userId: number;
  tokenId: string;
}
