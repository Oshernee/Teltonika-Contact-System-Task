<template>
  <div class="filtering flex gap-4 w-full">
    <Dropdown
      title="Įmonė:"
      placeholder="Filtruoti įmones..."
      filterBy="company_id"
      :items="props.employees"
      class="flex-1"
    />
    <Dropdown
      title="Ofisas:"
      placeholder="Filtruoti ofisus..."
      filterBy="office_id"
      :items="props.employees"
      class="flex-1"
    />
    <Dropdown
      title="Padalinys:"
      placeholder="Filtruoti padalinius..."
      filterBy="division_id"
      :items="props.employees"
      class="flex-1"
    />
    <Dropdown
      title="Skyrius:"
      placeholder="Filtruoti skyrius..."
      filterBy="department_id"
      :items="props.employees"
      class="flex-1"
    />
    <Dropdown
      title="Grupė:"
      placeholder="Filtruoti grupes..."
      filterBy="group_id"
      :items="props.employees"
      class="flex-1"
    />
  </div>
</template>

<script lang="ts" setup>
import type { Employee } from '../types/employees'

import Dropdown from './Dropdown.vue'

const props = defineProps<{
  employees: Employee[]
}>()
</script>
