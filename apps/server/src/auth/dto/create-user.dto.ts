import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
export class CreateUserDto {
  @IsNotEmpty()
  name!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @MinLength(6)
  password!: string;
}
