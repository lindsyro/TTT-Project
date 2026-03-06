import { Injectable } from '@nestjs/common';
import { UserResponse } from '../dto/user/user.response';
import { User } from 'src/layers/domain/models/user.entity';

@Injectable()
export class UserWebMapper {
  toWeb(domainUser: User, icon?: string): UserResponse {
    return {
      uuid: domainUser.uuid,
      login: domainUser.login,
      icon: icon || '',
    };
  }
}
