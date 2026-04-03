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
    /* async fetchUser() {
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
    }, */
    async fetchUser() {
      try {
        // 🚨 AJOUT CRUCIAL : On force l'URL absolue vers le serveur 151
        // Ainsi, même le 152 saura où aller chercher l'identité de l'utilisateur !
        const res = await $fetch<any>('http://172.16.1.151:4000/api/auth/user', { 
          credentials: 'include' 
        })
        
        if (res && res.user) {
          this.setUser(res.user)
        } else {
          this.setUser(null)
        }
      } catch (err) {
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