<template>
  <nav class="top-0 left-0 right-0 bg-secondary h-28 text-2xl">
    <div class="flex items-center justify-end h-full mr-12">
      <RouterLink to="/login" class="no-underline">
        <button
          class="px-4 py-2 text-white rounded hover:bg-accent transition-colors font-semibold"
        >
          Prisijungti
        </button>
      </RouterLink>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>
