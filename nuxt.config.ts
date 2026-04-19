export default defineNuxtConfig({
  modules: ['@pinia/nuxt', ],
  imports: {
    dirs: ['stores']
  },
  routeRules: {
    '/**': { cors: true },
  },
})