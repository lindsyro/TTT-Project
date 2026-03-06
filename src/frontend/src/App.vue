<template>
  <Header :title="route.meta.title || 'Крестики-нолики'"></Header>
  <main class="main-content">
    <router-view />
  </main>
</template>

<script setup>
import Header from './components/Header.vue'
import { useApp } from './composables/useApp'

const { route } = useApp()
</script>

<style>
body {
  margin: 0;
  padding: 0;
  font-family: Arial, Helvetica, sans-serif;
}

.main-content {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
