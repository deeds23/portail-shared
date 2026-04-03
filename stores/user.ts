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
        const res = await $fetch<any>('/api/auth/user', { 
          baseURL: '/', 
          credentials: 'include' 
        })
        
        // 🛠️ LOGIQUE DE DÉTECTION :
        // Si 'res' est directement l'utilisateur (contient preferred_username)
        // Sinon, si l'utilisateur est dans 'res.user'
        const userData = res?.preferred_username ? res : res?.user

        if (userData) {
          this.setUser(userData)
          console.log('✅ Store synchronisé avec :', userData.preferred_username)
        } else {
          console.error('❌ Format de réponse inconnu :', res)
          this.setUser(null)
        }
      } catch (err) {
        this.setUser(null)
        console.error('Fetch user failed:', err)
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