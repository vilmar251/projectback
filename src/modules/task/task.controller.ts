import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { controller, httpGet, httpPost, httpPut, request, response } from 'inversify-express-utils';
import { InversifyController } from '../../common/inversify.controller';
import { UnauthorizedError } from '../../errors';
import { TYPES } from '../../types/types';
import { validate } from '../../validator';
import { CreateTaskDto, UpdateTaskDto } from './dto';
import { FindTasksDto } from './dto/find-tasks.dto';
import TaskService from './task.service';

@controller('/task')
export default class TaskController extends InversifyController {
  constructor(
    @inject(TYPES.TaskService) private readonly taskService: TaskService
  ) {
    super();
  }



  @httpGet('/')
  private async findAll(@request() req: Request, @response() res: Response): Promise<void> {
    // Получаем и валидируем параметры запроса
    const params = validate(FindTasksDto, req.query);
    const result = await this.taskService.findAll(params);
    res.json(result);
  }

  @httpGet('/:id')
  private async findById(@request() req: Request, @response() res: Response): Promise<void> {
    const id = Number(req.params.id);
    const result = await this.taskService.findById(id);
    res.json(result);
  }

  @httpPost('/')
  private async create(@request() req: Request, @response() res: Response): Promise<void> {
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

  @httpPut('/:id')
  private async update(@request() req: Request, @response() res: Response): Promise<void> {
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
