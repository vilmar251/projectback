import { container } from '../../inversify.config';
import { TYPES } from '../../types/types';
import UserController from './user.controller';
import UserService from './user.service';

const service = container.get<UserService>(TYPES.UserService);
export const userController = new UserController(service);
