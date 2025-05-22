import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { TaskImportance, TaskStatus } from '../task.types';

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsEnum(TaskImportance)
  importance: TaskImportance;

  @IsEnum(TaskStatus)
  status: TaskStatus;

  @IsEnum(['low', 'medium', 'high'])
  severity: 'low' | 'medium' | 'high';

  @IsOptional()
  @IsNumber()
  assigneeId?: number;
}
