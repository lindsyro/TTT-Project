<template>
  <header class="header">
    <div class="header-container">
      <span class="page-title">{{ title }}</span>

      <nav class="nav-menu" v-if="currentUserId">
        <router-link to="/games" class="menu-btn">Список игр</router-link>
        <router-link to="/create" class="menu-btn">Создать игру</router-link>
      </nav>
    </div>
    <div class="user-controls" v-if="currentUserId">
      <span class="user-icon">👤</span>
      <span>Игрок: {{ username }}</span>
      <button @click="handleLogout" id="logoutBtn" class="logout-btn">Выход</button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useApp } from '@/composables/useApp'
import { computed } from 'vue'

const { store, router } = useApp()

defineProps<{
  title?: string
}>()

const currentUserId = computed(() => store.getters['auth/isLoggedIn'])
const username = computed(() => store.getters['auth/username'])

const handleLogout = () => {
  store.commit('auth/CLEAR_USER')
  store.commit('game/SET_CURRENT_GAME', null)
  router.push('/login')
}
</script>

<style scoped>
.page-title {
  color: #666;
}

.header-container {
  display: flex;
  align-items: center;
  gap: 30px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  background-color: #e0e0e0;
  padding: 15px 20px;
  border-bottom: 1px solid #ccc;
  margin-bottom: 20px;
  box-sizing: border-box;
}

.nav-menu {
  display: flex;
  gap: 15px;
}

.menu-btn {
  cursor: pointer;
  color: white;
  text-decoration: none;
  color: #666;
}

.menu-btn:hover {
  color: black;
  text-decoration: underline;
}

.router-link-active {
  text-decoration: underline;
}

.user-controls {
  display: flex;
  align-items: center;
  color: #666;
}

.user-icon {
  font-size: 1.5rem;
  margin-right: 10px;
}

.logout-btn {
  background-color: #d9534f;
  padding: 10px 20px;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 10px;
  font-size: 16px;
}

.logout-btn:hover {
  background-color: #c9302c;
}
</style>
