import { defineStore } from 'pinia'

interface User {
  preferred_username: string
  email?: string
  name?: string
  groups: string[]
  [key: string]: any
}

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as User | null,
    authenticated: false,
  }),

  actions: {
    setUser(userData: any) {
      this.user = userData
      this.authenticated = !!userData
    },

    async fetchUser() {
      try {
        // 🪄 LA CORRECTION EST ICI : On force la baseURL à '/'
        const res = await $fetch<{ user: User }>('/api/auth/user', { 
          credentials: 'include',
          baseURL: '/' 
        })
        this.setUser(res.user)
      } catch (err) {
        this.setUser(null)
        console.error('Fetch user failed:', err)
      }
    },

    async logout() {
      try {
        // 🪄 LA CORRECTION EST ICI AUSSI
        await $fetch('/api/auth/logout', { 
          method: 'GET', 
          credentials: 'include',
          baseURL: '/'
        })
        this.setUser(null)
        // La redirection commence déjà par un '/', donc elle tapera bien la racine du 151
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