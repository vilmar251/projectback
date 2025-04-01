type User = any;

const storage: User[] = [];

export const userRepository = {
  save(user: User) {
    storage.push(user);

    return true;
  },
};
