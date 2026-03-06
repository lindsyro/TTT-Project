import { ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import type { RootState } from '@/store'

export function useApp() {
  const store = useStore<RootState>()
  const router = useRouter()
  const route = useRoute()
  const errorMessage = ref('')

  const setError = (message: string, timeout = 3000) => {
    errorMessage.value = message
    if (timeout > 0) {
      setTimeout(() => {
        errorMessage.value = ''
      }, timeout)
    }
  }

  return {
    store,
    router,
    route,
    errorMessage,
    setError,
  }
}
