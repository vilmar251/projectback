import express, { Request, Response } from 'express';
import { validate } from '../../validator';
import { CreateTaskDto } from './dto';
import TaskRepository from './task.repository';
import TaskService from './task.service';

export default class TaskController {
  private router: express.Router;
  private taskService: TaskService;

  constructor() {
    this.router = express.Router();
    this.taskService = new TaskService(new TaskRepository());
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.router.get('/', this.findAll.bind(this));
    this.router.get('/:id', this.findById.bind(this));
    this.router.post('/', this.create.bind(this));
  }

  private findAll(req: Request, res: Response): void {
    const result = this.taskService.findAll();
    res.json(result);
  }

  private findById(req: Request, res: Response): void {
    const result = this.taskService.findById(req.params.id);
    res.json(result);
  }

  private create(req: Request, res: Response): void {
    const dto = validate(CreateTaskDto, req.body);
    const result = this.taskService.create(dto);
    res.status(201).json(result);
  }

  public getRouter(): express.Router {
    return this.router;
  }
}
