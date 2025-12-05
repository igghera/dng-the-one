import { useStorage } from '@vueuse/core'

export default defineNuxtRouteMiddleware((to, from) => {
  if (import.meta.server) return
  if (!!!from.name) return

  const state = useStorage('isFirstView', false)
  state.value = false
});
