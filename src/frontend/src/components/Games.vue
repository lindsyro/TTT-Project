<template>
  <div class="container">
    <div class="games-wrapper">
      <div class="button-row">
        <button @click="router.push('create')" class="btn-main">Создать игру</button>
        <button @click="handleFullReset" class="btn-danger">Очистить БД</button>
      </div>
      <div class="header-actions">
        <h1>Доступные игры</h1>
      </div>
      <div v-if="errorMessage" class="status-message error">
        {{ errorMessage }}
      </div>
      <div v-if="isLoading" class="loader">Загрузка...</div>
      <ul id="gameList" v-else>
        <li
          v-for="game in availableGames"
          :key="game.uuid"
          class="game-item"
          :class="[{ brokenGame: failedGameId === game.uuid }, getGameStatusClass(game)]"
          @click="join(game)"
        >
          <span class="game-owner">
            Создатель: <strong>{{ game.creator.login }}</strong>
          </span>
          <span class="game-id"> ID: {{ game.uuid.substring(0, 8) }} </span>
        </li>
      </ul>
      <div v-if="!isLoading && availableGames.length === 0" class="status-message">
        Нет игр для подключения
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useApp } from '@/composables/useApp'
import type { GameModel } from '@/models/game.model'

const { store, router, errorMessage, setError } = useApp()
const isLoading = computed(() => store.getters['game/isLoading'])
const sessionUserId = computed(() => store.getters['auth/isLoggedIn'])
const failedGameId = ref<string | null>(null)
const availableGames = computed(() => store.getters['game/availableGames'])

const loadGames = async () => {
  try {
    await store.dispatch('game/fetchGames')
  } catch (error: any) {
    setError(error.message || 'Ошибка загрузки списка игр')
  }
}

onMounted(loadGames)

const handleFullReset = async () => {
  if (confirm('Вы уверены? Все ваши игры будут удалены!')) {
    try {
      await store.dispatch('game/clearData')
      router.push('/login')
    } catch (error: any) {
      setError(error.message)
    }
  }
}

const join = async (game: GameModel) => {
  const isParticipant =
    game.creator.uuid === sessionUserId.value || game.opponent?.uuid === sessionUserId.value

  if (isParticipant) {
    router.push(`games/${game.uuid}`)
  } else {
    try {
      await store.dispatch('game/joinGame', game.uuid)
      router.push(`/games/${game.uuid}`)
    } catch (error) {
      failedGameId.value = game.uuid
      const msg = (error as Error).message || 'Игра более недоступна'
      setError(msg)

      setTimeout(() => {
        failedGameId.value = null
        loadGames()
      }, 2000)
    }
  }
}

const getGameStatusClass = (game: any) => {
  const userId = sessionUserId.value

  if (game.creator?.uuid === userId) return 'my-game'

  if (game.opponent?.uuid === userId) return 'participant'

  return 'open-game'
}
</script>

<style scoped>
.games-wrapper {
  background-color: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
  width: 450px;
  max-width: 90%;
  margin-top: 40px;
  max-height: 85vh;
}

.status-message {
  text-align: center;
}

.button-row {
  display: flex;
  flex-direction: row;
  gap: 10px;
  justify-content: center;
  width: 100%;
}

button {
  flex: 1;
  padding: 12px 10px;
  font-size: 14px;
  cursor: pointer;
  border: none;
  border-radius: 5px;
  transition: background-color 0.3s;
  white-space: nowrap;
}

.btn-main {
  background-color: #808284;
  color: white;
}

.btn-main:hover {
  background-color: #575656;
}

.btn-danger {
  background-color: #d9534f;
  color: white;
}

.btn-danger:hover {
  background-color: #c9302c;
}

#gameList {
  list-style-type: none;
  padding: 0;
  margin: 20px 0;
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #eee;
  text-align: left;
  overflow-y: scroll;
}

#gameList li {
  padding: 15px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

#gameList li.brokenGame {
  background-color: #ffebeb !important;
  animation: shake 0.5s;
}

#gameList::-webkit-scrollbar {
  width: 8px;
  display: block;
}

#gameList::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

#gameList::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 10px;
}

#gameList::-webkit-scrollbar-thumb:hover {
  background: #808284;
}

#gameList li:hover {
  background-image: linear-gradient(rgba(114, 112, 112, 0.1), rgba(117, 116, 116, 0.1));
}

.game-id {
  font-size: 11px;
  color: #bbb;
}

.game-owner {
  font-size: 15px;
  color: #333;
}

h1 {
  font-size: 22px;
  margin: 30px;
  text-align: center;
}

@keyframes shake {
  0% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-5px);
  }
  50% {
    transform: translateX(5px);
  }
  75% {
    transform: translateX(-5px);
  }
  100% {
    transform: translateX(0);
  }
}

.game-item.my-game {
  border-left: 5px solid #28a745; /* Зеленый */
  background-color: #f8fff9;
}

.game-item.participant {
  border-left: 5px solid #2078cb; /* Синий */
  background-color: #f0f7ff;
}

.game-item.open-game {
  border-left: 5px solid #ccc; /* Серый */
}
</style>
