import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { SeverityEnum, TaskImportance, TaskStatus } from '../task.types';

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsEnum(TaskImportance)
  importance: TaskImportance;

  @IsEnum(TaskStatus)
  status: TaskStatus;

  @IsEnum(SeverityEnum)
  severity: SeverityEnum;

  @IsOptional()
  @IsNumber()
  assigneeId?: number;
}
