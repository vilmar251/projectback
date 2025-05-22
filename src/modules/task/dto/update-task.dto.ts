import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { TaskImportance, TaskStatus } from '../task.types';

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(TaskImportance)
  importance?: TaskImportance;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @IsEnum(['low', 'medium', 'high'])
  severity?: 'low' | 'medium' | 'high';

  @IsOptional()
  @IsNumber()
  assigneeId?: number;
}
