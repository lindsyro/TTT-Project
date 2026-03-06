<template>
  <div class="auth-form">
    <div v-if="isLoading" class="loader">Создание игры...</div>

    <div class="button-group" v-else>
      <button @click="createGame('AI')" class="btn primary">Играть с компьютером</button>
      <button @click="createGame('PVP')" class="btn primary">Играть с другим игроком</button>
    </div>

    <div v-if="errorMessage" class="status-message error">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useApp } from '@/composables/useApp'
import { computed } from 'vue'

const { store, router, errorMessage, setError } = useApp()
const isLoading = computed(() => store.getters['game/isLoading'])

const createGame = async (mode: 'AI' | 'PVP') => {
  try {
    const game = await store.dispatch('game/createGame', mode)

    router.push(`/games/${game.uuid}`)
  } catch (error: any) {
    setError(error.message || 'Не удалось создать игру')
  }
}
</script>

<style scoped>
.button-group {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 15px;
}
</style>
