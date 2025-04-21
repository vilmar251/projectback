import TaskController from './task.controller';
import TaskRepository from './task.repository';
import TaskService from './task.service';

const taskRepository = new TaskRepository();
const taskService = new TaskService(taskRepository);
export const taskController = new TaskController(taskService);
