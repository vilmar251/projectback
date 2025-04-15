import { nanoid } from 'nanoid';
import { User } from './user.types';

export class UserRepository {
  private storage: User[] = [];

  save(user: Omit<User, 'id'>) {
    const id = nanoid(3);
    const createdUser = { ...user, id };
    this.storage.push(createdUser);
    return createdUser;
  }

  findByEmail(email: User['email']): User | null {
    return this.storage.find((user) => user.email === email) ?? null;
  }
}

export const userRepository = new UserRepository();
