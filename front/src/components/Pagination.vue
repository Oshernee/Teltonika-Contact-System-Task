<template>
  <div class="flex items-center justify-center w-full">
    <button
      :class="{ 'opacity-75 cursor-not-allowed': currentPage <= 1 || props.totalPages === 0 }"
      @click="changePage(currentPage - 1)"
      class="flex items-center px-4 py-2 bg-secondary text-white text-sm font-medium"
    >
      <img :src="Arrow" class="w-4 h-4 mr-2 rotate-180" alt="Previous" />
      PRAEITAS PUSLAPIS
    </button>
    <div class="px-4 py-2 text-xl font-bold text-gray-700">
      {{ props.totalPages == 0 ? 0 : currentPage }}/{{ props.totalPages }}
    </div>
    <button
      :class="{
        'opacity-75 cursor-not-allowed': currentPage >= props.totalPages || props.totalPages === 0,
      }"
      @click="changePage(currentPage + 1)"
      class="flex items-center px-4 py-2 bg-secondary text-white text-sm font-medium"
    >
      KITAS PUSLAPIS
      <img :src="Arrow" class="w-4 h-4 ml-2" alt="Next" />
    </button>
  </div>
</template>

<script lang="ts" setup>
import Arrow from '../assets/Arrows.svg'
import { ref } from 'vue'

const emit = defineEmits(['page-changed'])

const props = defineProps<{
  currentPage: number
  totalPages: number
}>()

const currentPage = ref(
  props.currentPage < 1 || props.currentPage > props.totalPages
    ? Math.max(1, props.totalPages)
    : props.currentPage
)

const changePage = (newPage: number) => {
  if (newPage < 1 || newPage > props.totalPages) return
  currentPage.value = newPage
  emit('page-changed', newPage)
}
</script>
