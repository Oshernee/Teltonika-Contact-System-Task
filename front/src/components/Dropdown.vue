<template>
  <div class="relative">
    <label class="block text-sm font-medium text-gray-700 mb-2">{{ props.title }}</label>
    <button
      @click="toggleDropdown"
      class="h-[36px] w-full px-4 rounded-lg bg-white border border-gray-300 flex items-center justify-between hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <span class="text-gray-700">{{ selectedItem || props.placeholder }}</span>
      <svg
        class="w-4 h-4 text-gray-500 transition-transform"
        :class="{ 'rotate-180': showDropdown }"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 9l-7 7-7-7"
        ></path>
      </svg>
    </button>
    <div
      v-if="showDropdown"
      class="absolute w-full top-full left-0 bg-white border border-gray-300 rounded-lg shadow-lg mt-1 z-10 max-h-60 overflow-y-auto"
    >
      <div
        v-for="item in options"
        :key="item"
        @click="selectItem(item)"
        class="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700 border-b border-gray-100 last:border-b-0"
        :class="{ 'bg-blue-50 text-blue-700': selectedItem === item }"
      >
        {{ item }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const props = defineProps<{
  title: string
  placeholder?: string
  options?: (string | number)[]
}>()

const emit = defineEmits<{
  'item-selected': [value: string | number]
}>()

const showDropdown = ref(false)
const selectedItem = ref<string | number | null>(null)

const options = props.options || [5, 10, 25, 50, 100, 'ALL']

function toggleDropdown() {
  showDropdown.value = !showDropdown.value
}

function selectItem(item: string | number) {
  selectedItem.value = item
  showDropdown.value = false
  emit('item-selected', item)
}

function handleClickOutside(event: Event) {
  const target = event.target as Element
  if (!target.closest('.relative')) {
    showDropdown.value = false
  }
}

if (typeof window !== 'undefined') {
  document.addEventListener('click', handleClickOutside)
}
</script>
