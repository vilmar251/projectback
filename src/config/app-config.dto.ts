import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class AppConfigDto {
  @IsNumber()
  @Type(() => Number)
  port: number;

  @IsString()
  postgresqlHost: string;

  @IsNumber()
  @Type(() => Number)
  postgresqlPort: number;
}
