<template>
  <div class="grid w-full grid-cols-4 gap-4">
    <Card v-for="employee in props.employees" :key="employee.id" :employee="employee" />
  </div>
</template>

<script setup lang="ts">
import Card from '@/components/cards/Card.vue'
import type { Employee } from '@/types/employees'

const props = defineProps<{
  employees: Employee[]
}>()
</script>
