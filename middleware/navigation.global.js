import { useStorage } from '@vueuse/core'

export default defineNuxtRouteMiddleware((to, from) => {
  if (import.meta.server) return
  if (!!!from.name) return

  const state = useStorage(STORAGE_LABELS.IS_FIRST_VIEW, false)
  state.value = false
});
