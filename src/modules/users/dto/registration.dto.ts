import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { UserRole } from '../../../database/entities/user.entity';

export class RegistrationDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @IsString()
  @MinLength(5, { message: 'Password must be at least 5 characters long' })
  password: string;

  @IsOptional()
  @IsEnum(UserRole, { message: 'Роль должна быть одной из: user, admin' })
  role?: UserRole;
}
