import logger from '../../logger/pino.logger';
import { taskRepository } from './task.repository';
import { Task } from './task.types';

export const taskService = {
  findAll() {
    logger.info('Чтение всего списка задач');

    return taskRepository.findAll();
  },

  findById(id: string) {
    logger.info(`Чтение задачи по id=${id}`);
    const task = taskRepository.findById(id);

    if (!task) {
      throw Error('Task not found');
    }

    return task;
  },

  create(task: Omit<Task, 'id'>) {
    logger.info(`Создание новой задачи title=${task.title}`);
    const result = taskRepository.save(task);

    return result;
  },
};
