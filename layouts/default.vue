<template>
  <div class="h-screen w-full flex flex-col bg-gray-50 overflow-hidden">
    <nav class="bg-neutral-primary w-full z-50 border-b border-default shadow-sm shrink-0">
      <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <NuxtLink to="/" external class="flex flew-auto items-center space-x-3">
          <img src="/logo_SO.png" class="h-7" alt="Logo" />
          <span class="self-center text-xl font-semibold whitespace-nowrap">Portail SO APP</span>
        </NuxtLink>

        <div v-if="userStore.authenticated" class="w-full md:block md:w-auto">
          <ul class="font-medium flex flex-col p-4 md:p-0 mt-4 border border-default rounded-base md:flex-row md:space-x-8 md:mt-0 md:border-0">
            <li>
              <div class="flex justify-between items-center px-4 max-w-screen-xl mx-auto">
                <div class="flex gap-3">
<NuxtLink 
    v-if="userStore.hasGroup('Test-acces-2')" 
    to="/app/carte" 
    external 
    class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition text-white">
    🚀 Carte
  </NuxtLink>
  <NuxtLink 
    v-if="userStore.hasGroup('Test-acces-1')" 
    to="/app/formulaire" 
    external 
    class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition text-white">
    🚀 Formulaire
  </NuxtLink>
                  <NuxtLink to="/app152/simple" external class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition text-white">🚀 Simple (152)</NuxtLink>
                  <NuxtLink to="/profile" external class="bg-green-600 hover:bg-green-700 px-4 py-2 rounded transition text-white">Profil</NuxtLink>
                  <button @click="userStore.logout" class="bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition text-white">Logout</button>
                </div>
              </div>
            </li>
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
  import { ref, onMounted } from 'vue'
  import { useUserStore } from '~/stores/user'
  
  const userStore = useUserStore()
  const activeApp = ref<string | null>(null)

  // On force la vérification de l'utilisateur au chargement du Layout !
  onMounted(async () => {
    if (!userStore.authenticated) {
      await userStore.fetchUser()
    }
  })
</script>