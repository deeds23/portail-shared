import { useUserStore } from '~/stores/user'

export default defineNuxtRouteMiddleware(async (to) => {
  // 🚨 L'EXCEPTION VITALE : On laisse passer la page de login !
  if (to.path === '/login') {
    return
  }

  const userStore = useUserStore()
  
  if (!userStore.authenticated) {
    await userStore.fetchUser()
  }
  
  if (!userStore.authenticated) {
    console.warn("🔒 Middleware Layer : Non authentifié, redirection vers login.")
    return navigateTo('/login', { external: true })
  }

  // Vérification dynamique du groupe
  const requiredGroup = to.meta.requiredGroup as string | undefined

  if (requiredGroup) {
    if (!userStore.hasGroup(requiredGroup)) {
      console.warn(`🔒 Middleware Layer : Accès refusé, le groupe "${requiredGroup}" est requis.`)
      return navigateTo('/', { external: true })
    }
  }
})