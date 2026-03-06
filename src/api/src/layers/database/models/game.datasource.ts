import {
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { BoardDatasource } from './board.datasource';
import { UserDatasource } from './user.datasource';
import type { GameState } from 'src/layers/domain/types/game-state.types';

@Table({
  tableName: 'games',
  timestamps: true,
})
export class GameDatasource extends Model<GameDatasource> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare uuid: string;

  @Column({
    type: DataType.JSONB,
    allowNull: false,
  })
  declare board: BoardDatasource;

  // Связь с создателем игры
  @ForeignKey(() => UserDatasource)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare userId: string;

  @BelongsTo(() => UserDatasource, 'userId')
  declare creator: UserDatasource;

  // Связь со вторым игроком
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  declare opponentId: string | null;

  @BelongsTo(() => UserDatasource, 'opponentId')
  declare opponent: UserDatasource | null;

  // Состояние игры
  @Column({
    type: DataType.JSONB,
    allowNull: false,
    defaultValue: { status: 'WAITING' },
  })
  declare state: GameState;
}
