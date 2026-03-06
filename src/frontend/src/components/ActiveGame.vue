<template>
  <div class="container">
    <div v-if="isLoading && !game && !errorMessage" class="loader">Загрузка...</div>

    <div v-if="errorMessage" class="error">
      <h1>{{ errorMessage }}</h1>
      <p>Вы будете перенаправлены к списку игр...</p>
    </div>

    <Game
      v-else-if="game"
      :game="game"
      @move-start="isWaitingForMove = true"
      @move-end="isWaitingForMove = false"
    />
  </div>
</template>

<script setup lang="ts">
import { useApp } from '@/composables/useApp'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { GameModel } from '@/models/game.model'
import Game from './Game.vue'

const { store, router, route, errorMessage, setError } = useApp()
let timer: ReturnType<typeof setInterval> | null = null
const isRedirecting = ref(false)
const isWaitingForMove = ref(false)

const game = computed(() => {
  const rawGame = store.getters['game/isCurrent']
  return rawGame ? new GameModel(rawGame) : null
})

const isLoading = computed(() => store.getters['game/isLoading'])

const stopTimer = () => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

const handleCriticalError = (msg: string) => {
  stopTimer()
  if (!isRedirecting.value) {
    isRedirecting.value = true
    errorMessage.value = msg

    setTimeout(() => {
      router.replace('/games')
      isRedirecting.value = false
      errorMessage.value = ''
    }, 3000)
  }
}

const update = async () => {
  if (isRedirecting.value || isWaitingForMove.value) return

  const uuid = route.params.uuid as string
  try {
    await store.dispatch('game/getGameById', { uuid, background: true })
    if (game.value && !['WAITING', 'PLAYING'].includes(game.value.state.status)) {
      stopTimer()
    }
  } catch (e: any) {
    handleCriticalError(e.message || 'Игра удалена')
  }
}

onMounted(async () => {
  const uuid = route.params.uuid as string
  store.commit('game/SET_CURRENT_GAME', null)

  try {
    await store.dispatch('game/getGameById', { uuid, background: false })
    if (game.value && ['WAITING', 'PLAYING'].includes(game.value.state.status)) {
      timer = setInterval(update, 2000)
    }
  } catch (e: any) {
    handleCriticalError(e.message || 'Игра недоступна')
  }
})

onUnmounted(() => stopTimer())
</script>
