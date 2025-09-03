<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar />
    <router-view />
    <Modal />
  </div>
</template>

<script setup lang="ts">
import Navbar from './components/Navbar.vue'
import Modal from './components/Modal.vue'
</script>

<style>
#app {
  font-family: 'Roboto', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
