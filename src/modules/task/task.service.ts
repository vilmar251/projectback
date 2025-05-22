import { TaskEntity } from '../../database/entities/task.entity';
import { UserEntity } from '../../database/entities/user.entity';
import { BadRequestError } from '../../errors';
import logger from '../../logger/pino.logger';
import { Task } from './task.types';

export default class TaskService {
  async findAll(): Promise<TaskEntity[]> {
    logger.info('Чтение всего списка задач');
    return TaskEntity.findAll({
      include: [
        {
          model: UserEntity,
          as: 'author',
          attributes: ['id', 'email']
        },
        {
          model: UserEntity,
          as: 'assignee',
          attributes: ['id', 'email']
        }
      ]
    });
  }

  async findById(id: number): Promise<TaskEntity | null> {
    logger.info(`Чтение задачи по id=${id}`);
    const task = await TaskEntity.findByPk(id, {
      include: [
        {
          model: UserEntity,
          as: 'author',
          attributes: ['id', 'email']
        },
        {
          model: UserEntity,
          as: 'assignee',
          attributes: ['id', 'email']
        }
      ]
    });
    if (!task) {
      throw Error('Task not found');
    }
    return task;
  }

  async create(task: Omit<Task, 'id'>): Promise<TaskEntity> {
    logger.info(`Создание задачи: ${task.title}`);
    
    // Проверяем существование исполнителя, если он указан
    if (task.assigneeId) {
      const assignee = await UserEntity.findByPk(task.assigneeId);
      if (!assignee) {
        logger.error(`Пользователь-исполнитель с id=${task.assigneeId} не найден`);
        throw new BadRequestError(`Пользователь-исполнитель с id=${task.assigneeId} не найден`);
      }
    }
    
    return TaskEntity.create(task as Omit<Task, 'id'>);
  }
}
