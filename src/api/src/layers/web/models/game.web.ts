import { BoardWeb } from './board.web';
import { UserResponse } from '../dto/user/user.response';
import type { GameState } from 'src/layers/domain/types/game-state.types';

export class GameWeb {
  uuid: string;
  board: BoardWeb;
  creator: UserResponse;
  opponent: UserResponse | null;
  state: GameState;
}
