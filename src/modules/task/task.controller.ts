import { Request, Response } from 'express';
import { BaseController } from '../../common';
import { UnauthorizedError } from '../../errors';
import { validate } from '../../validator';
import { CreateTaskDto, UpdateTaskDto } from './dto';
import { FindTasksDto } from './dto/find-tasks.dto';
import TaskService from './task.service';

export default class TaskController extends BaseController {
  constructor(private readonly taskService: TaskService) {
    super();

    this.initRoutes();
  }

  initRoutes(): void {
    this.addRoute({ method: 'get', path: '/', handler: this.findAll.bind(this) });
    this.addRoute({ method: 'get', path: '/:id', handler: this.findById.bind(this) });
    this.addRoute({ method: 'post', path: '/', handler: this.create.bind(this) });
    this.addRoute({ method: 'put', path: '/:id', handler: this.update.bind(this) });
  }

  private async findAll(req: Request, res: Response): Promise<void> {
    // Получаем и валидируем параметры запроса
    const params = validate(FindTasksDto, req.query);
    const result = await this.taskService.findAll(params);
    res.json(result);
  }

  private async findById(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id);
    const result = await this.taskService.findById(id);
    res.json(result);
  }

  private async create(req: Request, res: Response): Promise<void> {
    if (!req.session?.userId) {
      throw new UnauthorizedError('Пользователь не аутентифицирован');
    }

    const dto = validate(CreateTaskDto, req.body);
    const result = await this.taskService.create({
      ...dto,
      authorId: Number(req.session.userId),
    });
    res.status(201).json(result);
  }

  private async update(req: Request, res: Response): Promise<void> {
    if (!req.session?.userId) {
      throw new UnauthorizedError('Пользователь не аутентифицирован');
    }

    const id = Number(req.params.id);
    const dto = validate(UpdateTaskDto, req.body);

    // Обновляем задачу
    const result = await this.taskService.update(id, dto);
    res.json(result);
  }
}
