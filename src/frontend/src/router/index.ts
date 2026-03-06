import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/components/Login.vue'
import Register from '@/components/Register.vue'
import GameCreate from '@/components/GameCreate.vue'
import ActiveGame from '@/components/ActiveGame.vue'
import Games from '@/components/Games.vue'
import store from '@/store'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/games',
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: { title: 'Авторизация' },
    },
    {
      path: '/signup',
      name: 'signup',
      component: Register,
      meta: { title: 'Регистрация' },
    },
    {
      path: '/games',
      name: 'games',
      meta: { requiresAuth: true },
      component: Games,
    },
    {
      path: '/create',
      name: 'create',
      meta: { requiresAuth: true },
      component: GameCreate,
    },
    {
      path: '/games/:uuid',
      name: 'current-game',
      meta: { requiresAuth: true },
      component: ActiveGame,
    },
  ],
})

router.beforeEach((to, from) => {
  const isLoggedIn = store.getters['auth/isLoggedIn']

  const isPublicPage = ['/login', '/signup'].includes(to.path)

  if (!isPublicPage && !isLoggedIn) {
    return '/login'
  }
})

export default router
