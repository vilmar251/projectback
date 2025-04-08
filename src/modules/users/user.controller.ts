import express, { Request, Response } from 'express';
import { validate } from '../../validator';
import { LoginDto, RegistrationDto } from './dto';
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
  const body = validate(LoginDto, req.body);

  const result = userService.login(body);

  res.json(result);
});

// Регистрация нового пользователя
userController.post('/register', (req: Request, res: Response) => {
  const body = validate(RegistrationDto, req.body);

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
