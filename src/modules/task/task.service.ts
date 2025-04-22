import logger from '../../logger/pino.logger';
import TaskRepository from './task.repository';
import { Task } from './task.types';

export default class TaskService {
  constructor(private repository: TaskRepository) {}

  findAll(): Task[] {
    logger.info('Чтение всего списка задач');
    return this.repository.findAll();
  }

  findById(id: string): Task {
    logger.info(`Чтение задачи по id=${id}`);
    const task = this.repository.findById(id);

    if (!task) {
      throw Error('Task not found');
    }

    return task;
  }

  create(task: Omit<Task, 'id'>): Task {
    const taskInfo = `
=== Новая задача создана ===
Название: ${task.title}
Описание: ${task.description}
Важность: ${task.importance}
Статус: ${task.status}
----------------------------`;
    logger.info(taskInfo);
    return this.repository.save(task);
  }
}
