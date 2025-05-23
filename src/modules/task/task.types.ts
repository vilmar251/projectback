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
  authorId: number;
  createdAt: Date;
  updatedAt: Date;
  importance: TaskImportance;
  status: TaskStatus;
  severity: 'low' | 'medium' | 'high';
  assigneeId?: number;
};
