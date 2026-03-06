import type { UserDTO } from './models-types'

export class UserModel {
  public uuid: string
  public login: string
  public icon: string

  constructor(data: UserDTO) {
    this.uuid = data.uuid
    this.login = data.login
    this.icon = data.icon
  }
}
