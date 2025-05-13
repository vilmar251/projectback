import { Request, Response } from 'express';
import { BaseController } from '../../common';
import { UnauthorizedError } from '../../errors';
import { validate } from '../../validator';
import { CreateTaskDto } from './dto';
import TaskService from './task.service';

export default class TaskController extends BaseController {
  constructor(private readonly taskService: TaskService) {
    super();

    this.initRoutes();
  }

  initRoutes(): void {
    this.addRoute({ method: 'get', path: '/', handler: this.findAll });
    this.addRoute({ method: 'get', path: '/:id', handler: this.findById });
    this.addRoute({ method: 'post', path: '/', handler: this.create });
  }

  private findAll = async (req: Request, res: Response): Promise<void> => {
    const result = await this.taskService.findAll();
    res.json(result);
  };

  private findById = async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);
    const result = await this.taskService.findById(id);
    res.json(result);
  };

  private create = async (req: Request, res: Response): Promise<void> => {
    if (!req.session?.userId) {
      throw new UnauthorizedError('User is not authenticated');
    }

    const dto = validate(CreateTaskDto, req.body);
    const now = new Date();
    const result = await this.taskService.create({
      ...dto,
      userId: Number(req.session.userId),
      createdAt: now,
      updatedAt: now,
    });
    res.status(201).json(result);
  };
}
