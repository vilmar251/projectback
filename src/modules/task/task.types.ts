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

export class Task {
  id: string;
  title: string;
  description: string;
  importance: TaskImportance;
  status: TaskStatus;

  constructor(data: Partial<Task>) {
    this.id = data.id || '';
    this.title = data.title || '';
    this.description = data.description || '';
    this.importance = data.importance || TaskImportance.medium;
    this.status = data.status || TaskStatus.inProgress;
  }
}
