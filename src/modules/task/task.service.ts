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
    console.log('=== New Task Created ===');
    console.log('Title:', task.title);
    console.log('Description:', task.description);
    console.log('Importance:', task.importance);
    console.log('Status:', task.status);
    console.log('=====================');

    const result = taskRepository.save(task);
    return result;
  },
};
