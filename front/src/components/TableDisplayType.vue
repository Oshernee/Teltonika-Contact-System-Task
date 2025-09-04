<template>Display Type {{ props.employees }}</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import type { Employee } from '../types/employees'

const props = defineProps<{
  employees: Employee[]
}>()
</script>
