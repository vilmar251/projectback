import TaskController from './task.controller';
import TaskService from './task.service';

const taskService = new TaskService();
export const taskController = new TaskController(taskService);
