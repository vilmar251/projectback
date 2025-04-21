import { Request, Response } from 'express';
import { BaseController } from '../../common';
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

  private findAll(req: Request, res: Response): void {
    const result = this.taskService.findAll();
    res.json(result);
  }

  private findById(req: Request, res: Response): void {
    const id = req.params.id;
    const result = this.taskService.findById(id);
    res.json(result);
  }

  private create(req: Request, res: Response): void {
    const dto = validate(CreateTaskDto, req.body);
    const result = this.taskService.create(dto);
    res.status(201).json(result);
  }
}
