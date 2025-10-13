<template>
  <div class="w-[600px] h-[200px] p-6 space-y-6">
    <div>
      <h2 class="text-2xl">Laikinas slaptažodis:</h2>
    </div>
    <div class="space-y-4">
      <div class="space-y-2">
        <p class="text-text text-lg">
          Laikinas paskyros slaptažodis: <strong>{{ props.password }}</strong>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['update', 'close', 'updateCurrent', 'delete'])

const props = defineProps<{
  password: string
}>()
</script>
