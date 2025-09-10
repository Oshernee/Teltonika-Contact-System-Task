<template>
  <div class="min-h-screen bg-white">
    <Navbar />
    <router-view />
    <Modal />
    <Notifications />
  </div>
</template>

<script setup lang="ts">
import Navbar from './components/Navbar.vue'
import Modal from './components/Modal.vue'
import Notifications from './components/Notifications.vue'
</script>

<style>
#app {
  font-family: 'Roboto', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
