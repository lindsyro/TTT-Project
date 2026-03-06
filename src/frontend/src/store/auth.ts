import type { Module } from 'vuex'
import type { RootState } from './index'
import api from './api'

export interface AuthState {
  sessionUserId: string | null
  username: string | null
  isLoading: boolean
}

export const auth: Module<AuthState, RootState> = {
  namespaced: true,
  state: () => ({
    sessionUserId: sessionStorage.getItem('userId'),
    username: sessionStorage.getItem('username'),
    isLoading: false,
  }),
  getters: {
    isLoggedIn: (state) => state.sessionUserId,
    username: (state) => state.username,
    isLoading: (state) => state.isLoading,
  },
  mutations: {
    SET_USER(state, payload: { id: string; name: string }) {
      state.sessionUserId = payload.id
      state.username = payload.name
      sessionStorage.setItem('userId', payload.id)
      sessionStorage.setItem('username', payload.name)
    },
    SET_LOADING: (state, status: boolean) => {
      state.isLoading = status
    },
    CLEAR_USER(state) {
      state.sessionUserId = null
      state.username = null
      sessionStorage.removeItem('userId')
      sessionStorage.removeItem('username')
    },
  },
  actions: {
    async login({ commit }, { login, password }) {
      commit('SET_LOADING', true)
      try {
        const response = await api.get('auth/login', {
          auth: {
            username: login,
            password: password,
          },
        })

        const data = response.data
        commit('SET_USER', {
          id: data.userId,
          name: login,
        })
        return data
      } catch (e: any) {
        const message = e.response?.data?.message || 'Ошибка авторизации'
        throw new Error(message)
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async signup({ commit }, { login, password }) {
      commit('SET_LOADING', true)
      try {
        const response = await api.post('auth/signup', { login, password })

        const data = response.data

        if (data.userId) {
          commit('SET_USER', {
            id: data.userId,
            name: login,
          })
        }
        return data
      } catch (e: any) {
        const message = e.response?.data?.message || 'Ошибка регистрации'
        throw new Error(message)
      } finally {
        commit('SET_LOADING', false)
      }
    },
  },
}
