import { inject, injectable } from 'inversify';
import { Op } from 'sequelize';
import { TaskEntity } from '../../database/entities/task.entity';
import { UserEntity } from '../../database/entities/user.entity';
import { BadRequestError, NotFoundError } from '../../errors';
import logger from '../../logger/pino.logger';
import { RedisServiceInterface } from '../../services/redis/redis.types';
import { TYPES } from '../../types/types';
import { FindTasksDto } from './dto/find-tasks.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './task.types';

@injectable()
export default class TaskService {
  private readonly CACHE_TTL = 300; // Время жизни кеша в секундах (5 минут)
  private readonly TASK_CACHE_PREFIX = 'task:';
  private readonly TASKS_LIST_CACHE_PREFIX = 'tasks_list:';

  constructor(@inject(TYPES.RedisService) private readonly redisService: RedisServiceInterface) {}

  async findAll(params?: FindTasksDto): Promise<{ tasks: TaskEntity[]; total: number; page: number; limit: number }> {
    logger.info('Чтение списка задач с параметрами:', params);

    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const search = params?.search || '';

    const cacheKey = `${this.TASKS_LIST_CACHE_PREFIX}page:${page}:limit:${limit}:search:${search}`;

    try {
      const cachedData = await this.redisService.get(cacheKey);
      if (cachedData) {
        logger.info(`Получены данные из кеша: ${cacheKey}`);
        return JSON.parse(cachedData);
      }
    } catch (error) {
      logger.error(`Ошибка при получении данных из кеша: ${cacheKey}`, error);
    }

    const offset = (page - 1) * limit;

    // Формируем условия поиска, если указан параметр search
    const whereCondition: Record<string | symbol, unknown> = {};
    if (search) {
      whereCondition[Op.or as unknown as string] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
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

    const result = {
      tasks: rows,
      total: count,
      page,
      limit,
    };

    try {
      await this.redisService.set(cacheKey, JSON.stringify(result), this.CACHE_TTL);
      logger.info(`Данные сохранены в кеш: ${cacheKey}`);
    } catch (error) {
      logger.error(`Ошибка при сохранении данных в кеш: ${cacheKey}`, error);
    }

    return result;
  }

  async findById(id: number): Promise<TaskEntity | null> {
    logger.info(`Чтение задачи по id=${id}`);

    const cacheKey = `${this.TASK_CACHE_PREFIX}${id}`;

    try {
      const cachedTask = await this.redisService.get(cacheKey);
      if (cachedTask) {
        logger.info(`Получена задача из кеша: ${cacheKey}`);
        return JSON.parse(cachedTask);
      }
    } catch (error) {
      logger.error(`Ошибка при получении задачи из кеша: ${cacheKey}`, error);
    }

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

    try {
      await this.redisService.set(cacheKey, JSON.stringify(task), this.CACHE_TTL);
      logger.info(`Задача сохранена в кеш: ${cacheKey}`);
    } catch (error) {
      logger.error(`Ошибка при сохранении задачи в кеш: ${cacheKey}`, error);
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

    const newTask = await TaskEntity.create({ ...task });

    await this.invalidateTasksListCache();

    return newTask;
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

    await this.invalidateTaskCache(id);

    await this.invalidateTasksListCache();

    // Возвращаем обновленную задачу с данными автора и исполнителя
    const updatedTask = await this.findById(id);
    // Так как findById может вернуть null, но мы уже проверили существование задачи, поэтому мы можем быть уверены, что задача существует
    return updatedTask as TaskEntity;
  }

  async delete(id: number): Promise<void> {
    logger.info(`Удаление задачи с id=${id}`);

    // Проверяем существование задачи
    const task = await TaskEntity.findByPk(id);
    if (!task) {
      logger.error(`Задача с id=${id} не найдена`);
      throw new NotFoundError(`Задача с id=${id} не найдена`);
    }

    // Удаляем задачу
    await task.destroy();

    // Инвалидируем кеш для этой задачи
    await this.invalidateTaskCache(id);

    await this.invalidateTasksListCache();

    logger.info(`Задача с id=${id} успешно удалена`);
  }

  private async invalidateTaskCache(id: number): Promise<void> {
    try {
      const cacheKey = `${this.TASK_CACHE_PREFIX}${id}`;
      await this.redisService.del(cacheKey);
      logger.info(`Кеш задачи инвалидирован: ${cacheKey}`);
    } catch (error) {
      logger.error(`Ошибка при инвалидации кеша задачи с id=${id}`, error);
    }
  }

  private async invalidateTasksListCache(): Promise<void> {
    try {
      const keys = await this.redisService.keys(`${this.TASKS_LIST_CACHE_PREFIX}*`);

      if (keys.length > 0) {
        for (const key of keys) {
          await this.redisService.del(key);
        }
        logger.info(`Инвалидация кеша списка задач: удалено ${keys.length} ключей`);
      } else {
        logger.info('Ключи кеша списка задач не найдены');
      }
    } catch (error) {
      logger.error('Ошибка при инвалидации кеша списка задач', error);
    }
  }
}
