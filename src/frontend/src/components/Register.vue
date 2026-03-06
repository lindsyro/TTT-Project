<template>
  <div class="container">
    <form @submit.prevent="handleRegister" class="auth-form">
      <div class="auth-fields">
        <input
          v-model="formData.login"
          type="text"
          placeholder="Логин"
          required
          :disabled="isLoading"
        />

        <input
          v-model="formData.password"
          type="password"
          placeholder="Пароль"
          autocomplete="new-password"
          required
          :disabled="isLoading"
        />

        <input
          v-model="formData.confirmPassword"
          type="password"
          placeholder="Повторите пароль"
          required
          :disabled="isLoading"
        />
      </div>

      <div v-if="isLoading" class="loader">Регистрация...</div>

      <button type="submit" :disabled="isLoading" class="btn">Зарегистрироваться</button>

      <div v-if="errorMessage" class="status-message error">
        {{ errorMessage }}
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue'
import { useApp } from '@/composables/useApp'

const { store, router, errorMessage, setError } = useApp()

const isLoading = computed(() => store.getters['auth/isLoading'])
const formData = reactive({
  login: '',
  password: '',
  confirmPassword: '',
})

const handleRegister = async () => {
  if (formData.password !== formData.confirmPassword) {
    setError('Пароли не совпадают!')
    return
  }

  try {
    await store.dispatch('auth/signup', {
      login: formData.login,
      password: formData.password,
    })
    router.push('/login')
  } catch (error) {
    setError((error as Error).message)
  }
}
</script>

<style scoped></style>
