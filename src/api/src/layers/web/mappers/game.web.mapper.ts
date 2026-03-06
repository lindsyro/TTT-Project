import { GameWeb } from '../models/game.web';
import { BoardWebMapper } from './board.web.mapper';
import { Injectable } from '@nestjs/common';
import { UserWebMapper } from './user.web.mapper';
import { Game } from 'src/layers/domain/models/game.entity';

@Injectable()
export class GameWebMapper {
  constructor(
    private readonly userWebMapper: UserWebMapper,
    private readonly boardWebMapper: BoardWebMapper,
  ) {}

  toWeb(domainGame: Game): GameWeb {
    return {
      uuid: domainGame.uuid,
      board: this.boardWebMapper.toWeb(domainGame.board),
      creator: {
        ...this.userWebMapper.toWeb(domainGame.creator.user),
        icon: domainGame.creator.icon,
      },
      opponent: domainGame.opponent?.user
        ? {
            ...this.userWebMapper.toWeb(domainGame.opponent.user),
            icon: domainGame.opponent.icon,
          }
        : null,
      state: domainGame.state,
    };
  }
}
