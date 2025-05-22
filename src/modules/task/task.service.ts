import { TaskEntity } from '../../database/entities/task.entity';
import logger from '../../logger/pino.logger';
import { Task } from './task.types';

export default class TaskService {
  async findAll(): Promise<TaskEntity[]> {
    logger.info('Чтение всего списка задач');
    return TaskEntity.findAll();
  }

  async findById(id: number): Promise<TaskEntity | null> {
    logger.info(`Чтение задачи по id=${id}`);
    const task = await TaskEntity.findByPk(id);
    if (!task) {
      throw Error('Task not found');
    }
    return task;
  }

  async create(task: Omit<Task, 'id'>): Promise<TaskEntity> {
    logger.info(`Создание задачи: ${task.title}`);
    return TaskEntity.create(task as Omit<Task, 'id'>);
  }
}
