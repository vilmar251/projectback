import { TaskEntity } from '../../database/entities/task.entity';
import { UserEntity } from '../../database/entities/user.entity';
import logger from '../../logger/pino.logger';
import { Task } from './task.types';

export default class TaskService {
  async findAll(): Promise<TaskEntity[]> {
    logger.info('Чтение всего списка задач');
    return TaskEntity.findAll({
      include: [{
        model: UserEntity,
        as: 'author',
        attributes: ['id', 'email']
      }]
    });
  }

  async findById(id: number): Promise<TaskEntity | null> {
    logger.info(`Чтение задачи по id=${id}`);
    const task = await TaskEntity.findByPk(id, {
      include: [{
        model: UserEntity,
        as: 'author',
        attributes: ['id', 'email']
      }]
    });
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
