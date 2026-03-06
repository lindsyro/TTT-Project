import { Injectable } from '@nestjs/common';
import { UserDatasource } from '../models/user.datasource';
import type { Attributes } from 'sequelize';
import { User } from 'src/layers/domain/models/user.entity';

@Injectable()
export class UserMapper {
  /**
   * Преобразует доменную модель в формат для базы данных (Sequelize)
   */
  toDatasource(domainUser: User): Attributes<UserDatasource> {
    return {
      uuid: domainUser.uuid,
      login: domainUser.login,
      passwordHash: domainUser.passwordHash,
    } as Attributes<UserDatasource>;
  }

  /**
   * Преобразует данные из базы данных в чистую доменную модель
   */
  toDomain(datasourceUser: UserDatasource): User {
    const domainUser = new User(
      datasourceUser.uuid,
      datasourceUser.login,
      datasourceUser.passwordHash,
    );

    return domainUser;
  }
}
