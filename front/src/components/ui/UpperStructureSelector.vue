<template>
  <div>
    <label class="block text-xl mb-2">{{ props.upperStructureType }}:</label>
    <div class="border border-gray-300 rounded-md overflow-y-auto max-h-[240px]">
      <div
        v-for="structure in props.structures"
        :key="structure.id"
        @click="selectStructure(structure.id)"
        :class="[
          'px-4 py-3 cursor-pointer transition-colors text-center',
          selected.includes(structure.id)
            ? 'bg-blue-600 text-white'
            : 'bg-white text-gray-700 hover:bg-gray-100',
        ]"
      >
        {{ structure.name }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  structures: { id: string; name: string }[]
  upperStructureType: string
  modelValue?: string[] | null
}>()

const selected = ref(props.modelValue || [])
const emit = defineEmits(['update:modelValue'])

const selectStructure = (id: string) => {
  if (selected.value.includes(id)) {
    selected.value = selected.value.filter((item) => item !== id)
  } else {
    selected.value.push(id)
  }
  emit('update:modelValue', selected.value)
}
</script>
