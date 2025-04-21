import { Request, Response } from 'express';
import { validate } from '../../validator';
import { CreateTaskDto } from './dto';
import TaskRepository from './task.repository';
import TaskService from './task.service';
import { BaseController } from '../base/base.controller';

export default class TaskController extends BaseController {
  private readonly taskService: TaskService;

  constructor() {
    super();
    this.taskService = new TaskService(new TaskRepository());
  }

  protected setupRoutes(): void {
    this.addRoute('get', '/', this.findAll);
    this.addRoute('get', '/:id', this.findById);
    this.addRoute('post', '/', this.create);
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
