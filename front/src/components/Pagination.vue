<template>
  <div class="flex items-center justify-center w-full">
    <button
      @click="emit('page-changed', props.currentPage - 1)"
      class="flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium"
    >
      <img :src="Arrow" class="w-4 h-4 mr-2 rotate-180" alt="Previous" />
      PRAEITAS PUSLAPIS
    </button>
    <div class="px-4 py-2 text-xl font-bold text-gray-700">
      {{ props.currentPage }}/{{ props.totalPages }}
    </div>
    <button
      @click="emit('page-changed', props.currentPage + 1)"
      class="flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium"
    >
      KITAS PUSLAPIS
      <img :src="Arrow" class="w-4 h-4 ml-2" alt="Next" />
    </button>
  </div>
</template>

<script lang="ts" setup>
import Arrow from '../assets/Arrows.svg'

const emit = defineEmits(['page-changed'])

const props = defineProps<{
  currentPage: number
  totalPages: number
}>()
</script>
