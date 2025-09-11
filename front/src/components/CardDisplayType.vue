<template>
  <div class="grid w-full grid-cols-4 gap-4">
    <Card
      v-for="employee in props.employees"
      :key="employee.id"
      :employee="employee"
      @card-clicked="emit('card-clicked', employee.id)"
    />
  </div>
</template>

<script setup lang="ts">
import Card from './Card.vue'
import type { Employee } from '../types/employees'

const emit = defineEmits(['card-clicked'])

const props = defineProps<{
  employees: Employee[]
}>()
</script>
