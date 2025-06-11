export interface RedisServiceInterface {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, expireSeconds?: number): Promise<void>;
  del(key: string): Promise<void>;
  exists(key: string): Promise<boolean>;
  flushDb(): Promise<void>;
  keys(pattern: string): Promise<string[]>;
  
  // Методы для работы с множествами (sets)
  sadd(key: string, ...members: string[]): Promise<number>;
  sismember(key: string, member: string): Promise<number>;
  smembers(key: string): Promise<string[]>;
  srem(key: string, ...members: string[]): Promise<number>;
  expire(key: string, seconds: number): Promise<number>;
}
