import express, { Request, Response } from 'express';
import logger from '../../logger/pino.logger';
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
  logger.info('Получен запрос на авторизацию', { email: req.body.email });
  const body = validate(LoginDto, req.body);
  const result = userService.login(body);
  logger.info('Пользователь успешно авторизован', { email: result.email });
  res.json(result);
});

// Регистрация нового пользователя
userController.post('/register', (req: Request, res: Response) => {
  logger.info('Получен запрос на регистрацию', { email: req.body.email });
  const body = validate(RegistrationDto, req.body);
  const result = userService.create(body);
  logger.info('Пользователь успешно зарегистрирован', { email: result.email });
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
