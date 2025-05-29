import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class AppConfigDto {
  @IsNumber()
  @Type(() => Number)
  port: number;

  @IsString()
  postgresqlHost: string;

  @IsNumber()
  @Type(() => Number)
  postgresqlPort: number;

  @IsString()
  postgresqlUser: string;

  @IsString()
  postgresqlPassword: string;

  @IsString()
  postgresqlDatabase: string;

  @IsString()
  redisHost: string;

  @IsNumber()
  @Type(() => Number)
  redisPort: number;

  @IsString()
  @IsOptional()
  redisPassword: string;

  @IsNumber()
  @Type(() => Number)
  redisDb: number;
}
