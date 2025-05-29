export interface RedisServiceInterface {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, expireSeconds?: number): Promise<void>;
  del(key: string): Promise<void>;
  exists(key: string): Promise<boolean>;
  flushDb(): Promise<void>;
}
