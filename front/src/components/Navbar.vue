<template>
  <nav v-if="!isInLogin" class="top-0 left-0 right-0 bg-secondary h-28 text-2xl">
    <div v-if="!isLoggedIn" class="flex items-center justify-end h-full mr-12">
      <RouterLink to="/login" class="no-underline">
        <button
          class="px-4 py-2 text-white rounded hover:bg-accent transition-colors font-semibold"
        >
          Prisijungti
        </button>
      </RouterLink>
    </div>
    <div v-else class="flex items-center justify-center h-full mr-12 gap-20">
      <RouterLink to="/" class="no-underline">
        <button
          class="px-4 py-2 text-white rounded hover:bg-accent transition-colors font-semibold"
        >
          Kontaktai
        </button>
      </RouterLink>
      <RouterLink to="/companies" class="no-underline">
        <button
          class="px-4 py-2 text-white rounded hover:bg-accent transition-colors font-semibold"
        >
          Įmonės
        </button>
      </RouterLink>
      <RouterLink to="/structures" class="no-underline">
        <button
          class="px-4 py-2 text-white rounded hover:bg-accent transition-colors font-semibold"
        >
          Struktūra
        </button>
      </RouterLink>
      <RouterLink v-if="isAdmin" to="/admin" class="no-underline">
        <button
          class="px-4 py-2 text-white rounded hover:bg-accent transition-colors font-semibold"
        >
          Paskyros
        </button>
      </RouterLink>
      <div class="absolute right-4">
        <button
          @click="toggleDropdown"
          class="flex items-center text-white rounded hover:bg-accent transition-colors text-2xl p-2 font-normal"
        >
          <img :src="NavbarIcon" alt="Profile" class="hover:opacity-75" />
        </button>

        <div
          v-if="isDropdownOpen"
          class="absolute right-0 mt-6 w-48 bg-white rounded-md shadow-lg z-10 border"
        >
          <RouterLink to="/password-recovery" class="no-underline">
            <button
              @click="handleProfile"
              class="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors rounded-t-md text-sm"
            >
              Pakeisti slaptažodį
            </button>
          </RouterLink>
          <button
            @click="handleLogout"
            class="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors rounded-b-md text-sm"
          >
            Atsijungti
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router'
import { computed, ref } from 'vue'
import { useUserStore } from '../stores/Auth'

import NavbarIcon from '../assets/NavbarIcon.svg'

const userStore = useUserStore()

const route = useRoute()

const isInLogin = computed(() => route.path === '/login' || route.path === '/password-recovery')

const isLoggedIn = computed(() => userStore.isLoggedIn())

const isDropdownOpen = ref(false)

const isAdmin = computed(() => {
  console.log(userStore.user?.name)
  return userStore.user?.name === 'Admin'
})

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const handleProfile = () => {
  console.log('Profile selected')
  isDropdownOpen.value = false
}

const handleLogout = () => {
  userStore.clearUser()
  isDropdownOpen.value = false
}
</script>
