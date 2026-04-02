// 3. Actions
  actions: {
    setUser(userData: any) {
      this.user = userData
      this.authenticated = !!userData
    },

    async fetchUser() {
      try {
        // 🪄 On force baseURL: '/' pour sortir de /app152/ et taper sur le 151
        const res = await $fetch<{ user: User }>('/api/auth/user', { 
          baseURL: '/', 
          credentials: 'include' 
        })
        this.setUser(res.user)
      } catch (err) {
        this.setUser(null)
        console.error('Fetch user failed:', err)
      }
    },

    async logout() {
      try {
        // 🪄 Pareil ici pour la déconnexion
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
    
    // ... (le reste du code hasGroup ne change pas)