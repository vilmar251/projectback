export interface JwtServiceInterface {
  generateToken(payload: Record<string, any>): string;
  verifyToken(token: string): Record<string, any> | null;
  extractUserIdFromToken(token: string): number | null;
}
