import { defineStore } from 'pinia'

interface User {
  preferred_username: string
  email?: string
  name?: string
  groups: string[]
  [key: string]: any
}

export const useUserStore = defineStore('user', {
  // 2. State
  state: () => ({
    user: null as User | null,
    authenticated: false,
  }),

  // 3. Actions
  actions: {
    setUser(userData: any) {
      this.user = userData
      this.authenticated = !!userData
      console.log('Données reçues par setUser:', userData)
    },

      
   /*  async fetchUser() {
      try {
        const res = await $fetch<{ user: User }>('/api/auth/user', { 
          baseURL: '/', 
          credentials: 'include' 
        })
        this.setUser(res.user)
      } catch (err) {
        this.setUser(null)
        console.error('Fetch user failed:', err)
      }
    }, */
   async fetchUser() {
      try {
        console.log('📡 Appel API /api/auth/user en cours...')
        const res = await $fetch<any>('/api/auth/user', { 
          credentials: 'include' 
        })
        
        console.log('📥 Réponse brute reçue :', res)

        // On cherche l'utilisateur soit dans res.user, soit dans res tout court
        const userData = res?.user ? res.user : (res?.preferred_username ? res : null)
        
        if (userData) {
          this.setUser(userData)
        } else {
          console.warn('⚠️ Aucun utilisateur trouvé dans la réponse')
          this.setUser(null)
        }
      } catch (err) {
        console.error('❌ Erreur réseau fetchUser:', err)
        this.setUser(null)
      }
    },
    async logout() {
      try {
        await $fetch('/api/auth/logout', { 
          method: 'GET', 
          baseURL: '/',
          credentials: 'include' 
        })
        this.setUser(null)
        window.location.href = '/login'
      } catch (err) {
        console.error('Logout failed:', err)
      }
    },

    hasGroup(targetGroup: string): boolean {
      if (!this.user || !Array.isArray(this.user.groups)) {
        return false
      }
      const targetClean = targetGroup.toLowerCase().replace(/^\//, '')
      return this.user.groups.some((userGroup: string) => {
        const groupClean = userGroup.toLowerCase().replace(/^\//, '')
        return groupClean === targetClean
      })
    }
  }
})