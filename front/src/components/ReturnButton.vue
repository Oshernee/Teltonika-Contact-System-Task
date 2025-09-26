<template>
  <button
    class="absolute mt-16 mr-16 right-0 border p-3 rounded-full shadow-md hover:bg-gray-200 transition-colors"
    @click="$router.go(-1)"
  >
    <img :src="Back" alt="Back" class="w-8 h-8" />
  </button>
</template>

<script setup lang="ts">
import Back from '../assets/Return.svg'
</script>
