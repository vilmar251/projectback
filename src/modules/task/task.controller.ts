import { Request, Response } from 'express';
import { inject } from 'inversify';
import { controller, httpDelete, httpGet, httpPost, httpPut, request, response } from 'inversify-express-utils';
import { InversifyController } from '../../common/inversify.controller';
import { jwtAuthMiddleware } from '../../middleware/jwt-auth.middleware';
import { TYPES } from '../../types/types';
import { validate } from '../../validator';
import { CreateTaskDto, UpdateTaskDto } from './dto';
import { FindTasksDto } from './dto/find-tasks.dto';
import TaskService from './task.service';

@controller('/task')
export default class TaskController extends InversifyController {
  constructor(@inject(TYPES.TaskService) private readonly taskService: TaskService) {
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

  @httpPost('/', jwtAuthMiddleware())
  private async create(@request() req: Request, @response() res: Response): Promise<void> {
    const dto = validate(CreateTaskDto, req.body);
    const result = await this.taskService.create({
      ...dto,
      authorId: Number(req.userId),
    });
    res.status(201).json(result);
  }

  @httpPut('/:id', jwtAuthMiddleware())
  private async update(@request() req: Request, @response() res: Response): Promise<void> {
    const id = Number(req.params.id);
    const dto = validate(UpdateTaskDto, req.body);

    // Обновляем задачу
    const result = await this.taskService.update(id, dto);
    res.json(result);
  }

  @httpDelete('/:id', jwtAuthMiddleware())
  private async delete(@request() req: Request, @response() res: Response): Promise<void> {
    const id = Number(req.params.id);

    // Удаляем задачу
    await this.taskService.delete(id);
    res.status(204).send();
  }
}
