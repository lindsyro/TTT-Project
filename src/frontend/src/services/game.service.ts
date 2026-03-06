import type { GameModel } from '@/models/game.model'

export class GameService {
  static getStatusLabel(game: GameModel, currentUserId: string): string {
    const state = game.state

    switch (state.status) {
      case 'WAITING':
        return 'Ожидание игроков'

      case 'PLAYING':
        if (state.playerUUID === currentUserId) {
          return 'Ваш ход'
        }

        const activePlayer = game.creator.uuid === state.playerUUID ? game.creator : game.opponent

        return `Ходит соперник ${activePlayer?.login || '...'}`

      case 'WON':
        return state.playerUUID === currentUserId ? 'Победа!' : 'Поражение'

      case 'DRAW':
        return 'Ничья'

      default:
        return ''
    }
  }
}
