<template>
  <div class="game-wrapper">
    <h2>Игра: {{ game.uuid.substring(0, 8) }}</h2>

    <div class="players-info">
      <div class="player-box" :class="{ active: game.state.playerUUID === game.creator.uuid }">
        <span class="badge x">{{ game.creator.icon }}</span>
        <span class="login">{{ game.creator.login }} </span>
      </div>

      <div class="vs">VS</div>

      <div class="player-box" :class="{ active: game.state.playerUUID === game.opponent?.uuid }">
        <span class="badge o">{{ game.opponent?.icon }}</span>
        <span v-if="game.opponent" class="login">{{ game.opponent.login }} </span>
        <span v-else class="login waiting">Ожидание...</span>
      </div>
    </div>

    <h2 :class="statusClass">{{ statusMessage }}</h2>

    <GameBoard
      :data="game.board"
      :disabled="!game.isMyTurn"
      :icons="{
        1: game.creator.icon,
        2: game.opponent?.icon || 'O',
      }"
      @move="handleMove"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useApp } from '@/composables/useApp'
import { GameService } from '@/services/game.service'
import GameBoard from './GameBoard.vue'

const { store } = useApp()
const props = defineProps({ game: Object, required: true })
const game = computed(() => props.game)
const emit = defineEmits(['error'])
const userId = sessionStorage.getItem('userId')
const errorMessage = ref('')

const statusMessage = computed(() => {
  return GameService.getStatusLabel(props.game, userId)
})

const statusClass = computed(() => ({
  'text-win': statusMessage.value === 'Победа!',
  'text-lose': statusMessage.value === 'Поражение' || statusMessage.value === 'Ничья',
  'text-turn': statusMessage.value === 'Ваш ход',
}))

const handleMove = async (coords) => {
  errorMessage.value = ''
  try {
    await store.dispatch('game/updateGameById', {
      uuid: game.value.uuid,
      coords,
    })
  } catch (err) {
    emit('error', err.message || 'Ошибка хода')
    setTimeout(() => {
      errorMessage.value = ''
    }, 3000)
  }
}
</script>

<style scoped>
.game-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}
.players-info {
  display: flex;
  align-items: center;
  gap: 30px;
  margin-bottom: 10px;
}
.player-box {
  padding: 10px 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid transparent;
}
.player-box.active {
  border-color: #ccc;
}
.badge {
  font-weight: bold;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  color: white;
}
.badge.x {
  background: #d9534f;
}
.badge.o {
  background: #2078cb;
}
.vs {
  font-weight: bold;
  color: #999;
}
.text-turn {
  text-align: center;
}
.text-win {
  color: #047458;
  text-align: center;
}
.text-lose {
  text-align: center;
  color: #d9534f;
}
.error-toast {
  position: fixed;
  bottom: 30px;
  background: #ff4d4f;
  color: white;
  padding: 10px 25px;
  border-radius: 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}
</style>
