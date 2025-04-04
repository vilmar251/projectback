import { nanoid } from 'nanoid';
import { User } from './user.types';

const storage: User[] = [];

export const userRepository = {
  save(user: Omit<User, 'id'>) {
    const id = nanoid(3);
    const createdUser = { ...user, id };
    storage.push(createdUser);

    return true;
  },
};
