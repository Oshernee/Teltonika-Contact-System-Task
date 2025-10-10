<template>
  <div class="flex items-center gap-2">
    <input
      type="checkbox"
      id="edit_permissions"
      name="edit_permissions"
      class="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded"
      :checked="props.modelValue"
      @change="handleChange"
    />
    <label for="edit_permissions" class="text-lg font-medium cursor-pointer select-none">
      {{ props.label }}
    </label>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps<{
  label: string
  modelValue: boolean | undefined
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.checked)
}
</script>
