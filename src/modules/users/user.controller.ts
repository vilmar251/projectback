import express, { Request, Response } from 'express';

const userController = express.Router();

// Удаление пользователя
userController.delete('/profile', (req: Request, res: Response) => {
  res.status(501).json({ message: 'Not Implemented' });
});

// Получение списка пользователей
userController.get('/profile', (req: Request, res: Response) => {
  res.status(501).json({ message: 'Not Implemented' });
});

// Логин пользователя
userController.post('/login', (req: Request, res: Response) => {
  res.status(501).json({ message: 'Not Implemented' });
});

// Регистрация нового пользователя
userController.post('/registration', (req: Request, res: Response) => {
  res.status(501).json({ message: 'Not Implemented' });
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
