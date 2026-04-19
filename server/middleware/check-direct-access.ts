export default defineEventHandler((event) => {
  const path = event.path

  // Ignorer assets, HMR et îlots
  if (
    path.startsWith('/_nuxt/') ||
    path.startsWith('/__nuxt_island/') ||
    path.startsWith('/api/')
  ) return

  const config = useRuntimeConfig()
  const portalUrl = (config.public.portalUrl as string) || ''

  // Pas de portalUrl configuré → pas de restriction
  if (!portalUrl) return

  // Si la requête passe par un proxy (nginx, portail), X-Forwarded-Host est présent
  const forwardedHost = getRequestHeader(event, 'x-forwarded-host')
  if (forwardedHost) return

  // Accès direct détecté → redirection vers le portail
  return sendRedirect(event, `${portalUrl}/login`, 302)
})
