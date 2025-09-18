<template>
  <button
    v-if="props.side === 'left'"
    class="bg-white absolute mt-16 ml-16 left-0 border p-3 rounded-full shadow-md hover:bg-gray-200 transition-colors"
    @click="$router.go(-1)"
  >
    <img :src="Back" alt="Back" class="w-8 h-8" />
  </button>
  <button
    v-else
    class="bg-white absolute mt-16 mr-16 right-0 border p-3 rounded-full shadow-md hover:bg-gray-200 transition-colors"
    @click="$router.go(-1)"
  >
    <img :src="Back" alt="Back" class="w-8 h-8" />
  </button>
</template>

<script setup lang="ts">
import Back from '@/assets/Return.svg'

const props = defineProps<{
  side?: string
}>()
</script>
