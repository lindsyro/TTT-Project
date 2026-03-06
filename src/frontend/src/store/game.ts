import type { Module } from 'vuex'
import type { RootState } from './index'
import api from './api'
import type { GameModel } from '@/models/game.model'

export interface GameState {
  games: GameModel[]
  currentGame: GameModel | null
  isLoading: boolean
}

export const game: Module<GameState, RootState> = {
  namespaced: true,
  state: () => ({
    games: [],
    currentGame: null,
    isLoading: false,
  }),
  getters: {
    availableGames: (state) => state.games,
    isLoading: (state) => state.isLoading,
    isCurrent: (state) => state.currentGame,
  },

  mutations: {
    SET_GAMES: (state, games) => {
      state.games = games
    },
    SET_CURRENT_GAME: (state, game) => {
      state.currentGame = game
    },
    SET_LOADING: (state, status) => {
      state.isLoading = status
    },
  },

  actions: {
    async request({ commit }, { url, method = 'GET', data = null, showLoading = true }) {
      if (showLoading) commit('SET_LOADING', true)
      try {
        const response = await api({
          url,
          method,
          data,
        })
        return response.data
      } catch (e: any) {
        const message = e.response?.data?.message || e.message || 'Ошибка сервера'
        throw new Error(message)
      } finally {
        if (showLoading) commit('SET_LOADING', false)
      }
    },

    async fetchGames({ dispatch, commit }) {
      const data = await dispatch('request', { url: 'web/games' })
      commit('SET_GAMES', data)
    },

    async createGame({ dispatch }, mode: 'AI' | 'PVP') {
      return await dispatch('request', {
        url: 'web',
        method: 'POST',
        data: { mode },
      })
    },

    async clearData({ dispatch, commit }) {
      await dispatch('request', { url: 'web/games', method: 'DELETE' })
      commit('auth/CLEAR_USER', null, { root: true })
    },

    async joinGame({ dispatch, commit }, uuid: string) {
      const data = await dispatch('request', {
        url: `web/games/${uuid}/join`,
        method: 'POST',
      })
      commit('SET_CURRENT_GAME', data)
      return data
    },

    async getGameById({ dispatch, commit }, { uuid, background = false }) {
      const data = await dispatch('request', {
        url: `web/games/${uuid}`,
        method: 'GET',
        showLoading: !background,
      })
      commit('SET_CURRENT_GAME', data)
      return data
    },

    async updateGameById({ dispatch, commit }, { uuid, coords }) {
      const data = await dispatch('request', {
        url: `web/games/${uuid}`,
        method: 'POST',
        data: {
          row: coords.row,
          col: coords.col,
        },
      })
      commit('SET_CURRENT_GAME', data)
      return data
    },
  },
}
