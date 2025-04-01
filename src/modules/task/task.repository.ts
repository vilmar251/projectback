import { nanoid } from 'nanoid';
import { Task } from './task.types';

const storage: Task[] = []; // Это сейчас является БАЗОЙ ДАННЫХ

export const taskRepository = {
  save(task: Omit<Task, 'id'>) {
    const id = nanoid(3);
    const createdTask = { ...task, id };

    storage.push(createdTask);

    return createdTask;
  },

  findById(id: string) {
    return storage.find((task) => task.id === id) ?? null;
  },

  findAll() {
    return storage;
  },
};
