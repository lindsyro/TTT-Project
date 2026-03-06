export type Cell = 0 | 1 | 2

export interface GameState {
  status: 'WAITING' | 'PLAYING' | 'WON' | 'DRAW'
  playerUUID?: string
}

export interface UserDTO {
  uuid: string
  login: string
  icon: string
}

export interface BoardDTO {
  field: Cell[][]
}

export interface GameResponseDTO {
  uuid: string
  board: BoardDTO
  state: GameState
  creator: UserDTO
  opponent: UserDTO | null
}
