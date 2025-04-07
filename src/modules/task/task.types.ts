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

export type Task = {
  id: string;
  title: string;
  description: string;
  importance: TaskImportance;
  status: TaskStatus;
};
