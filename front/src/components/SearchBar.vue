<template>
  <div class="w-full flex gap-4">
    <div class="relative">
      <img
        :src="searchIcon"
        alt="Search"
        class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
      />
      <input
        class="input w-[574px] h-[56px] pl-10 pr-4 rounded-lg bg-background border border-gray-300 text-text placeholder-gray-500"
        type="text"
        placeholder="Search"
        v-on:input="handleInput"
      />
    </div>
    <div class="relative">
      <button
        @click="toggleDropdown"
        class="w-[56px] h-[56px] px-4 rounded-lg bg-accent flex items-center justify-between"
      >
        <img :src="paginationCount" alt="Pagination Count" class="w-[56px] h-[56px]" />
      </button>
      <div
        v-if="showDropdown"
        class="absolute top-full left-0 w-[56px] bg-white border border-gray-300 rounded-lg shadow-lg mt-1 z-10"
      >
        <div
          v-for="item in [5, 10, 25, 50, 100, 'ALL']"
          :key="item"
          @click="selectItemCountPerPage(item)"
          class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
        >
          {{ item }}
        </div>
      </div>
    </div>
    <button
      class="w-[56px] h-[56px] bg-accent rounded-lg flex items-center justify-center hover:bg-accent-dark"
      @click="toggleView"
    >
      <img v-if="isCard" :src="toCard" alt="Search" />
      <img v-else-if="!isCard" :src="toTable" alt="Search" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import debounce from 'debounce'

import { DEFAULT_CONSTANTS } from '../constants/defaultConstants'
import { UNALLOWED_CHARACTERS } from '../constants/unallowedCharacters'

import searchIcon from '../assets/Search.svg'
import paginationCount from '../assets/PaginationCount.svg'
import toCard from '../assets/ToCard.svg'
import toTable from '../assets/ToTable.svg'

const showDropdown = ref(false)
const selectedCount = ref<number | string | null>(null)
const isCard = ref(true)

const emit = defineEmits(['changeView', 'changeCount', 'input-changed'])

const debouncedEmit = debounce((value: string) => {
  emit('input-changed', value)
}, 300)

const validateSearchInput = (value: string) => {
  for (const char in UNALLOWED_CHARACTERS) {
    if (value.includes(char)) {
      return false
    }
  }
  return true
}

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = target.value
  if (validateSearchInput(value)) {
    debouncedEmit(value)
  }
}

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

const selectItemCountPerPage = (item: number | string) => {
  if (item === 'ALL') {
    selectedCount.value = 'ALL'
    showDropdown.value = false
    emit('changeCount', DEFAULT_CONSTANTS.SHOW_ALL_EMPLOYEES)
    return
  }
  selectedCount.value = item
  showDropdown.value = false
  emit('changeCount', item)
}

const toggleView = () => {
  isCard.value = !isCard.value
  emit('changeView')
}
</script>
