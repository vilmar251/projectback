import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import express, { Request, Response } from 'express';
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
  const instance = plainToInstance(CreateTaskDto, req.body);
  const errors = validateSync(instance);
  if (errors.length) {
    const constraints = errors[0].constraints;
    let message = 'Unknown validation error';

    if (constraints) {
      const key = Object.keys(constraints)[0];
      message = constraints[key];
    }

    throw Error(message);
  }

  const result = taskService.create(instance);

  res.json(result);
});

export default taskController;
