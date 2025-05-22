import { Op } from 'sequelize';
import { TaskEntity } from '../../database/entities/task.entity';
import { UserEntity } from '../../database/entities/user.entity';
import { BadRequestError, NotFoundError } from '../../errors';
import logger from '../../logger/pino.logger';
import { FindTasksDto } from './dto/find-tasks.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './task.types';

export default class TaskService {
  async findAll(params?: FindTasksDto): Promise<{ tasks: TaskEntity[]; total: number; page: number; limit: number }> {
    logger.info('Чтение списка задач с параметрами:', params);

    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const offset = (page - 1) * limit;

    // Формируем условия поиска, если указан параметр search
    const whereCondition: any = {};
    if (params?.search) {
      whereCondition[Op.or] = [
        { title: { [Op.like]: `%${params.search}%` } },
        { description: { [Op.like]: `%${params.search}%` } },
      ];
    }

    // Получаем задачи с пагинацией и поиском
    const { count, rows } = await TaskEntity.findAndCountAll({
      where: whereCondition,
      limit,
      offset,
      include: [
        {
          model: UserEntity,
          as: 'author',
          attributes: ['id', 'email'],
        },
        {
          model: UserEntity,
          as: 'assignee',
          attributes: ['id', 'email'],
        },
      ],
      order: [['updatedAt', 'DESC']],
    });

    return {
      tasks: rows,
      total: count,
      page,
      limit,
    };
  }

  async findById(id: number): Promise<TaskEntity | null> {
    logger.info(`Чтение задачи по id=${id}`);
    const task = await TaskEntity.findByPk(id, {
      include: [
        {
          model: UserEntity,
          as: 'author',
          attributes: ['id', 'email'],
        },
        {
          model: UserEntity,
          as: 'assignee',
          attributes: ['id', 'email'],
        },
      ],
    });
    if (!task) {
      throw new NotFoundError('Задача не найдена');
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

  async update(id: number, updateData: UpdateTaskDto): Promise<TaskEntity> {
    logger.info(`Обновление задачи с id=${id}`);

    // Проверяем существование задачи
    const task = await TaskEntity.findByPk(id);
    if (!task) {
      logger.error(`Задача с id=${id} не найдена`);
      throw new NotFoundError(`Задача с id=${id} не найдена`);
    }

    // Проверяем существование исполнителя, если он указан и изменился
    if (updateData.assigneeId !== undefined && updateData.assigneeId !== task.assigneeId) {
      const assignee = await UserEntity.findByPk(updateData.assigneeId);
      if (!assignee) {
        logger.error(`Пользователь-исполнитель с id=${updateData.assigneeId} не найден`);
        throw new BadRequestError(`Пользователь-исполнитель с id=${updateData.assigneeId} не найден`);
      }
    }

    // Обновляем задачу
    await task.update(updateData);

    // Возвращаем обновленную задачу с данными автора и исполнителя
    const updatedTask = await this.findById(id);
    // Так как findById может вернуть null, но мы уже проверили существование задачи, поэтому мы можем быть уверены, что задача существует
    return updatedTask as TaskEntity;
  }
}
