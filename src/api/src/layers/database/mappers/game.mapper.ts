import { GameDatasource } from '../models/game.datasource';
import { BoardMapper } from './board.mapper';
import { Injectable } from '@nestjs/common';
import type { Attributes } from 'sequelize';
import { UserMapper } from './user.mapper';
import { Game } from 'src/layers/domain/models/game.entity';

@Injectable()
export class GameMapper {
  constructor(
    private readonly userMapper: UserMapper,
    private readonly boardMapper: BoardMapper,
  ) {}

  toDatasource(domainGame: Game): Attributes<GameDatasource> {
    return {
      uuid: domainGame.uuid,
      board: this.boardMapper.toDatasource(domainGame.board),
      userId: domainGame.creator.user.uuid,
      opponentId: domainGame.opponent?.user.uuid || null,
      state: domainGame.state,
    } as Attributes<GameDatasource>;
  }

  toDomain(datasourceGame: GameDatasource): Game {
    const data = datasourceGame.get({ plain: true });
    const creator = this.userMapper.toDomain(data.creator);

    const domainGame = new Game(
      data.uuid,
      this.boardMapper.toDomain(data.board),
      creator,
    );

    domainGame.opponent = data.opponent
      ? {
          user: this.userMapper.toDomain(data.opponent),
          icon: 'O',
        }
      : null;

    domainGame.state = data.state;

    return domainGame;
  }
}
