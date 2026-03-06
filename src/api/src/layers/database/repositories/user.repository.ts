import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserDatasource } from '../models/user.datasource';
import { User } from '../../domain/models/user.entity';
import { UserMapper } from '../mappers/user.mapper';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(UserDatasource)
    private readonly userModel: typeof UserDatasource,
    private readonly userMapper: UserMapper,
  ) {}

  /**
   * Сохранение или обновление пользователя
   */
  async save(user: User): Promise<User> {
    const data = this.userMapper.toDatasource(user);

    const [entity] = await this.userModel.upsert(data, {
      returning: true,
    });

    return this.userMapper.toDomain(entity);
  }

  /**
   * Поиск по логину
   */
  async findOneByLogin(login: string): Promise<User | null> {
    const entity = await this.userModel.findOne({ where: { login } });

    return entity ? this.userMapper.toDomain(entity) : null;
  }

  /**
   * Поиск по UUID (используем встроенный findByPk)
   */
  async findOneByUuid(uuid: string): Promise<User | null> {
    const entity = await this.userModel.findByPk(uuid);

    return entity ? this.userMapper.toDomain(entity) : null;
  }
}
