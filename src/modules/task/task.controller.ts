import express, { Request, Response } from 'express';
import { validate } from '../../validator';
import { CreateTaskDto } from './dto';
import { taskService } from './task.service';

const taskController = express.Router();

taskController.get('/', (req: Request, res: Response) => {
  const result = taskService.findAll();

  res.json(result);
});

taskController.get('/:id', (req: Request, res: Response) => {
  const result = taskService.findById(req.params.id);

  res.json(result);
});

taskController.post('/', (req: Request, res: Response) => {
  const dto = validate(CreateTaskDto, req.body);
  const result = taskService.create(dto);

  res.json(result);
});

export default taskController;
