type User = {
  id: string;
  email: string;
  password: string;
};

const storage: User[] = [];

export const userRepository = {
  save(user: User) {
    storage.push(user);

    return true;
  },
};
