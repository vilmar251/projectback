import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegistrationDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @IsString()
  @MinLength(5, { message: 'Password must be at least 5 characters long' })
  password: string;
}
