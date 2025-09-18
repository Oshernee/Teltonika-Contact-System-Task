<template>
  <div class="min-h-screen bg-white">
    <Navbar />
    <router-view />
    <Modal />
    <Notifications />
  </div>
</template>

<script setup lang="ts">
import Navbar from '@/components/ui/Navbar.vue'
import Modal from '@/components/ui/Modal.vue'
import Notifications from '@/components/ui/Notifications.vue'
import { useUserStore } from '@/stores/Auth'
import { onMounted } from 'vue'
import { subscribeToPermissionChanges } from '@/services/pocketbaseSubscriptionService'

const userStore = useUserStore()

onMounted(() => {
  if (userStore.refreshUser() && userStore.user) {
    subscribeToPermissionChanges(userStore.user.permissions_id)
  }
})
</script>

<style>
#app {
  font-family: 'Roboto', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
