import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class AuthDto {
  @IsNotEmpty()
  @IsEmail({}, { message: 'Incorrect email format' })
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;
}
