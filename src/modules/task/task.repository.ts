import { nanoid } from 'nanoid';
import { Task } from './task.types';

export default class TaskRepository {
  private storage: Task[] = [];

  save(task: Omit<Task, 'id'>): Task {
    const id = nanoid(3);
    const createdTask = new Task({ ...task, id });
    this.storage.push(createdTask);
    return createdTask;
  }

  findById(id: string): Task | null {
    return this.storage.find((task) => task.id === id) ?? null;
  }

  findAll(): Task[] {
    return this.storage;
  }
}
