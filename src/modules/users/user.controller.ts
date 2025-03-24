import express, { Request, Response } from 'express';
import { userService } from './user.service';

const userController = express.Router();

userController.get('/profile', (req: Request, res: Response) => {
  const profile = userService.profile();

  res.json(profile);
});

userController.post('/login', (req: Request, res: Response) => {
  res.json({ message: 'Вы запросили задачу по id', id: req.params.id });
});

userController.post('/registration', (req: Request, res: Response) => {
  res.json({ message: 'Вы пытаетесь создать новую задачу' });
});

export default userController;
