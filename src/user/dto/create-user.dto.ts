import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @MinLength(6, { message: 'Password must be grand then 6' })
  @MaxLength(32, { message: 'Password must be less then 32' })
  password: string;
}
