import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserService } from '../domain/services/user.service';
import { User } from '../domain/models/user.entity';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  /**
   * Регистрация: принимает DTO, хеширует пароль, создает доменную модель
   */
  async register(login: string, password: string): Promise<boolean> {
    if (!login?.trim() || !password?.trim()) {
      throw new BadRequestException('Логин и пароль не могут быть пустыми');
    }

    const existing = await this.userService.findByLogin(login);
    if (existing) {
      throw new BadRequestException('Игрок с таким логином уже существует');
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const newUser = User.create(login, hash);

    await this.userService.create(newUser);

    return true;
  }

  /**
   * Авторизация: декодирует base64 и проверяет учетные данные
   */
  async authorize(base64Credentials: string): Promise<string> {
    const decoded = Buffer.from(base64Credentials, 'base64').toString('utf-8');
    const [login, password] = decoded.split(':');

    const user = await this.userService.findByLogin(login);

    if (
      !user ||
      !user.passwordHash ||
      !(await bcrypt.compare(password, user.passwordHash))
    ) {
      throw new UnauthorizedException('Неверный логин или пароль');
    }

    return user.uuid;
  }
}
