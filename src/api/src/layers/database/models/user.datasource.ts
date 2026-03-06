import {
  Column,
  DataType,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { GameDatasource } from './game.datasource';

@Table({ tableName: 'users', timestamps: true })
export class UserDatasource extends Model<UserDatasource> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    unique: true,
  })
  declare uuid: string;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  declare login: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare passwordHash: string;

  // Игры, где пользователь является создателем
  @HasMany(() => GameDatasource, 'userId')
  declare createdGames: GameDatasource[];

  // Игры, где пользователь является оппонентом
  @HasMany(() => GameDatasource, 'opponentId')
  declare opponentGames: GameDatasource[];
}
