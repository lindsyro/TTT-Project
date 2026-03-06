import { createStore } from 'vuex'
import { auth } from './auth'
import { game } from './game'

import type { AuthState } from './auth'
import type { GameState } from './game'

export interface RootState {
  auth: AuthState
  game: GameState
}

export default createStore<RootState>({
  modules: {
    auth,
    game,
  },
})
