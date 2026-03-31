import { defineStore } from 'pinia'

// 1. Définition de l'interface pour TypeScript
interface User {
  preferred_username: string
  email?: string
  name?: string
  groups: string[] // Le tableau des groupes venant de Keycloak
  [key: string]: any // Autorise d'autres propriétés dynamiques
}

export const useUserStore = defineStore('user', {
  // 2. State
  state: () => ({
    user: null as User | null,
    authenticated: false,
  }),

  // 3. Actions
  actions: {
    // Met à jour l'état local
    setUser(userData: any) {
      this.user = userData
      this.authenticated = !!userData
    },

    // Récupère l'utilisateur depuis l'API serveur Nuxt
    async fetchUser() {
      try {
        const res = await $fetch<{ user: User }>('/api/auth/user', { credentials: 'include' })
        this.setUser(res.user)
      } catch (err) {
        this.setUser(null)
        console.error('Fetch user failed:', err)
      }
    },

    // Déconnecte l'utilisateur
    async logout() {
      try {
        await $fetch('/api/auth/logout', { method: 'GET', credentials: 'include' })
        this.setUser(null)
        // Redirection forcée vers la page de login pour nettoyer l'état navigateur
        window.location.href = '/login'
      } catch (err) {
        console.error('Logout failed:', err)
      }
    },

    /**
     * Vérifie si l'utilisateur appartient à un groupe.
     * Robuste : Ignore la casse (Maj/Min) et les slashs initiaux.
     * Exemple : hasGroup('test-acces-1') validera "/Test-acces-1"
     */
    hasGroup(targetGroup: string): boolean {
      // Sécurité : si pas d'user ou pas de liste de groupes, c'est non.
      if (!this.user || !Array.isArray(this.user.groups)) {
        return false
      }

      // 1. On nettoie le groupe recherché (minuscule + sans slash au début)
      const targetClean = targetGroup.toLowerCase().replace(/^\//, '')

      // 2. On cherche dans la liste des groupes de l'utilisateur
      return this.user.groups.some((userGroup: string) => {
        // On nettoie le groupe reçu de Keycloak (minuscule + sans slash au début)
        const groupClean = userGroup.toLowerCase().replace(/^\//, '')
        
        return groupClean === targetClean
      })
    }
  }
})
