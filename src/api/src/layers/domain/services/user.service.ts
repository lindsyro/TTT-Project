import { Injectable, ConflictException } from '@nestjs/common';
import { User } from '../models/user.entity';
import { UserRepository } from '../../database/repositories/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  /**
   * Регистрация нового пользователя
   */
  async create(user: User): Promise<User> {
    const existingUser = await this.userRepository.findOneByLogin(user.login);

    if (existingUser) {
      throw new ConflictException('Такой игрок уже существует');
    }

    // Репозиторий должен возвращать сохраненную сущность
    return await this.userRepository.save(user);
  }

  /**
   * Поиск пользователя по логину
   */
  async findByLogin(login: string): Promise<User | null> {
    return this.userRepository.findOneByLogin(login);
  }

  /**
   * Поиск пользователя по UUID
   */
  async findByUuid(uuid: string): Promise<User | null> {
    const user = await this.userRepository.findOneByUuid(uuid);
    return user || null;
  }
}
