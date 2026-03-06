import { IsString, MinLength, IsNotEmpty } from 'class-validator';

export class SignUpRequest {
  @IsString()
  @IsNotEmpty({ message: 'Логин не может быть пустым' })
  @MinLength(3, { message: 'Логин слишком короткий' })
  login: string;

  @IsString()
  @IsNotEmpty({ message: 'Пароль обязателен' })
  @MinLength(8, { message: 'Пароль должен быть не менее 8 символов' })
  password: string;
}
