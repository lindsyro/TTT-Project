import { v4 as uuidv4 } from 'uuid';

/**
 * Модель пользователя
 */
export class User {
  /**
   * Уникальный идентификатор пользователя
   */
  public readonly uuid: string;

  /**
   * Логин пользователя
   */
  public readonly login: string;

  /**
   * Хешированный пароль
   */
  public readonly passwordHash: string;

  constructor(uuid: string, login: string, passwordHash: string) {
    this.uuid = uuid;
    this.login = login;
    this.passwordHash = passwordHash;
  }

  /**
   * Статический метод для создания нового пользователя
   * @param login - логин
   * @param passwordHash - захешированный пароль
   * @returns возвращает экземпляр пользователя
   */
  static create(login: string, passwordHash: string): User {
    return new User(uuidv4(), login, passwordHash);
  }
}
