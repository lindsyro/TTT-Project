<template>
  <div class="container">
    <form @submit.prevent="handleLogin" class="auth-form">
      <div class="auth-fields">
        <input
          v-model="formData.login"
          type="text"
          placeholder="Логин"
          autocomplete="username"
          required
          :disabled="isLoading"
        />

        <input
          v-model="formData.password"
          type="password"
          placeholder="Пароль"
          autocomplete="current-password"
          required
          :disabled="isLoading"
        />
      </div>

      <div v-if="isLoading" class="loader">Вход в систему...</div>

      <div class="button-group">
        <button type="submit" :disabled="isLoading" class="btn">Войти</button>
        <button @click="router.push('/signup')" type="button" :disabled="isLoading" class="btn">
          Регистрация
        </button>
      </div>
      <div v-if="errorMessage" class="status-message error">
        {{ errorMessage }}
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useApp } from '@/composables/useApp'
import { reactive, computed } from 'vue'

const { store, router, errorMessage, setError } = useApp()
const isLoading = computed(() => store.getters['auth/isLoading'])
const formData = reactive({
  login: '',
  password: '',
})

const handleLogin = async () => {
  if (formData.login.length < 3) {
    setError('Логин слишком короткий')
    return
  }

  try {
    await store.dispatch('auth/login', {
      login: formData.login,
      password: formData.password,
    })

    router.push('/games')
  } catch (error) {
    setError((error as Error).message)
  }
}
</script>

<style scoped></style>
