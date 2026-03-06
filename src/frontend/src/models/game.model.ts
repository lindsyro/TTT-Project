import { BoardModel } from './board.model'
import { UserModel } from './user.model'
import type { GameResponseDTO, GameState } from './models-types'

export class GameModel {
  public uuid: string
  public board: BoardModel
  public state: GameState
  public creator: UserModel
  public opponent: UserModel | null

  constructor(data: GameResponseDTO) {
    this.uuid = data.uuid
    this.board = new BoardModel(data.board)
    this.state = data.state
    this.creator = new UserModel(data.creator)
    this.opponent = data.opponent ? new UserModel(data.opponent) : null
  }

  get isMyTurn(): boolean {
    const currentUserId = sessionStorage.getItem('userId')
    return this.state.status === 'PLAYING' && this.state.playerUUID === currentUserId
  }
}
