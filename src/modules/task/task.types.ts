import { ImportanceEnum, SeverityEnum, StatusEnum } from '../../database/entities/task.entity';

// Используем перечисления из сущности
export { ImportanceEnum as TaskImportance, StatusEnum as TaskStatus, SeverityEnum };

export type Task = {
  id: string;
  title: string;
  description: string;
  authorId: number;
  importance: ImportanceEnum;
  status: StatusEnum;
  severity: SeverityEnum;
  assigneeId?: number;
  // Поля createdAt и updatedAt будут добавлены автоматически Sequelize
};
