export default defineNuxtRouteMiddleware(async (to) => {
  const config = useRuntimeConfig().public
  const portalUrl = config.portalUrl as string
  const bypass = (config.authBypassPaths as string[]) ?? []   // ← à ajouter

  if (to.path.startsWith('/login') || bypass.some(p => to.path.startsWith(p))) return

  const userStore = useUserStore()
  if (!userStore.authenticated) {
    await userStore.fetchUser()
  }

  if (!userStore.authenticated) {
    return navigateTo(`${portalUrl}/login`, { external: !!portalUrl })
  }

  if (to.meta.requiredGroup) {
    const requiredGroup = to.meta.requiredGroup as string
    if (!userStore.hasGroup(requiredGroup)) {
      return navigateTo(portalUrl || '/', { external: !!portalUrl })
    }
  }
})