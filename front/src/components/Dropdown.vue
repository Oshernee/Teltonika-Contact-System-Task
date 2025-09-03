<template>
  <div class="relative">
    <button
      @click="toggleDropdown"
      class="w-[56px] h-[56px] px-4 rounded-lg bg-accent flex items-center justify-between"
    ></button>
    <div
      v-if="showDropdown"
      class="absolute top-full left-0 w-[56px] bg-white border border-gray-300 rounded-lg shadow-lg mt-1 z-10"
    >
      <div
        v-for="item in [5, 10, 25, 50, 100, 'ALL']"
        :key="item"
        @click="selectItemCountPerPage()"
        class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
      >
        {{ item }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const showDropdown = ref(false)

function toggleDropdown() {
  showDropdown.value = !showDropdown.value
}

function selectItemCountPerPage() {
  // Handle item selection
}
</script>
