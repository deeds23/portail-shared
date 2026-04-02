import { useUserStore } from '~/stores/user'

export default defineNuxtRouteMiddleware(async (to) => {
  const userStore = useUserStore()
  
  // 1. On tente de récupérer l'utilisateur si le store est vide
  if (!userStore.authenticated) {
    await userStore.fetchUser()
  }
  
  // 2. Si ça échoue (pas de cookie), on jette vers le login
  if (!userStore.authenticated) {
    console.warn("🔒 Middleware Layer : Non authentifié, redirection vers login.")
    return navigateTo('/login', { external: true })
  }

  // 3. 🚨 LA MAGIE DU LAYER : Vérification dynamique du groupe
  // On lit la propriété personnalisée "requiredGroup" que l'on définira sur nos pages
  const requiredGroup = to.meta.requiredGroup as string | undefined

  if (requiredGroup) {
    if (!userStore.hasGroup(requiredGroup)) {
      console.warn(`🔒 Middleware Layer : Accès refusé, le groupe "${requiredGroup}" est requis.`)
      return navigateTo('/', { external: true }) // Retour à l'accueil
    }
  }
})