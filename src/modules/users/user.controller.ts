import express, { Request, Response } from 'express';
import { userService } from './user.service';

const userController = express.Router();

// Удаление пользователя
userController.delete('/profile', (req: Request, res: Response) => {
  res.status(501).json({ message: 'Not Implemented' });
});

// Получение списка пользователей
userController.get('/profile/:id', (req: Request, res: Response) => {
  const id = Number(req.params.id);

  const result = userService.getProfile(id);
  res.json(result);
});

// Логин пользователя
userController.post('/login', (req: Request, res: Response) => {
  res.status(501).json({ message: 'Not Implemented' });
});

// Регистрация нового пользователя
userController.post('/register', (req: Request, res: Response) => {
  const body = req.body;

  const result = userService.create(body);

  res.json(result);
});

// Обновление данных пользователя
userController.put('/profile', (req: Request, res: Response) => {
  res.status(501).json({ message: 'Not Implemented' });
});

// Удаление пользователя
userController.delete('/profile', (req: Request, res: Response) => {
  res.status(501).json({ message: 'Not Implemented' });
});

export default userController;
