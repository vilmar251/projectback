export enum TaskImportance {
  low = 'low',
  medium = 'medium',
  high = 'high',
  criticaL = 'critical',
}

export enum TaskStatus {
  inProgress = 'in_progress',
  review = 'review',
  done = 'done',
}

export interface Task {
  id: string;
  title: string;
  description: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
  importance: TaskImportance;
  status: TaskStatus;
}

export class Task {
  id: string;
  title: string;
  description: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
  importance: TaskImportance;
  status: TaskStatus;

  constructor(data: Partial<Task>) {
    this.id = data.id || '';
    this.title = data.title || '';
    this.description = data.description || '';
    this.authorId = data.authorId || '';
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
    this.importance = data.importance || TaskImportance.medium;
    this.status = data.status || TaskStatus.inProgress;
  }
}
