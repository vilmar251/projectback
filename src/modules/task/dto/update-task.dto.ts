import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { SeverityEnum, TaskImportance, TaskStatus } from '../task.types';

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
  @IsEnum(SeverityEnum)
  severity?: SeverityEnum;

  @IsOptional()
  @IsNumber()
  assigneeId?: number;
}
