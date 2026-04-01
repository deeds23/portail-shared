<template>
  <div class="h-screen w-full flex flex-col bg-gray-50 overflow-hidden">
    <nav class="bg-neutral-primary w-full z-50 border-b border-default shadow-sm shrink-0">
      <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="/" class="flex items-center space-x-3">
          <img src="/logo_SO.png" class="h-7" alt="Logo" />
          <span class="self-center text-xl font-semibold whitespace-nowrap">Portail SO</span>
        </a>

        <div v-if="userStore.authenticated" class="w-full md:block md:w-auto">
          <ul class="font-medium flex flex-col p-4 md:p-0 mt-4 border border-default rounded-base md:flex-row md:space-x-8 md:mt-0 md:border-0">
          
            <li>
                 <header class="bg-slate-900 text-white p-4 shadow-md w-full shrink-0">
      <div class="flex justify-between items-center px-4 max-w-screen-xl mx-auto">
        <h1 class="font-bold">Dashboard Central</h1>
        
        <div class="flex gap-3">
          <button 
            @click="allerVersApp152" 
            class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition text-white"
          >
            🚀 App 152
          </button>
          <button 
            @click="allerVersApp1522" 
            class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition text-white"
          >
            🚀 App 152
          </button>
          <button 
            @click="allerVersApp1523" 
            class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition text-white"
          >
            🚀 App 152
          </button>
          
          <button 
            @click="activeApp = 'voxa'" 
            :class="activeApp === 'voxa' ? 'bg-emerald-700 ring-2 ring-white' : 'bg-emerald-600 hover:bg-emerald-700'"
            class="px-4 py-2 rounded transition text-white"
          >
            🐍 Voxa
          </button>

          <button 
            @click="activeApp = null" 
            class="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded transition ml-4 text-white"
          >
            Accueil
          </button>
        </div>
      </div>
    </header>

            </li>
            <li><a href="/profile" class="text-blue-600 font-bold hover:underline">Profil</a></li>
            <li><button @click="userStore.logout" class="px-3 py-1 bg-red-600 text-white rounded">Logout</button></li>
          </ul>
        </div>
      </div>
    </nav>

    <main class="flex-1 w-full flex flex-col overflow-auto">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useUserStore } from '~/stores/user'
const userStore = useUserStore()
onMounted(async () => {
  await userStore.fetchUser()
})
// On gère uniquement l'état de l'Iframe (pour Voxa)
const activeApp = ref(null)

// Fonction magique de Nuxt pour l'App 152
const allerVersApp152 = () => {
  // naviagteTo change l'URL du navigateur instantanément vers votre nouvelle page !
  navigateTo('/app152/carte')
}
const allerVersApp1522 = () => {
  // naviagteTo change l'URL du navigateur instantanément vers votre nouvelle page !
  navigateTo('/app152/simple')
}
const allerVersApp1523 = () => {
  // naviagteTo change l'URL du navigateur instantanément vers votre nouvelle page !
  navigateTo('/app152/formulaire')
}
</script>