import { Expose } from 'class-transformer';

export class UserResponse {
  @Expose()
  uuid: string;

  @Expose()
  login: string;

  @Expose()
  icon: string | '';
}
