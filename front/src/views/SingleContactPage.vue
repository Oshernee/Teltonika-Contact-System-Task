<template>
  <div class="mx-16 my-4 bg-white text-left font-extralight flex flex-col items-start gap-4">
    <text class="text-[56px] text-text font-thin">Detalesnė kontaktų informacija</text>
    <div class="w-16 h-16 rounded-full flex items-center justify-center mr-3">
      <img
        v-if="employee.photo !== null"
        :src="getPhotoUrl(employee.photo)"
        :alt="props.employee.name + ' ' + props.employee.surname"
        class="w-16 h-16 rounded-full object-cover"
      />
      <img v-else :src="Profile" class="w-16 h-16" alt="Profile" />
    </div>
    <div>
      <h3 class="font-semibold text-black">
        {{ props.employee.name + ' ' + props.employee.surname || 'Vardas ir pavardė' }}
      </h3>
      <p class="text-sm text-gray-500">Pozicija: {{ props.employee.position || 'Nėra duomenų' }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

import { getSingleEmployee } from '../services/employeeService'
import { getPhotoUrl } from '../utils/photoUtils'

import type { Employee } from '../types/employees'

const employee = ref<Employee | null>(null)

const props = defineProps<{
  id: string
}>()

onMounted(async () => {
  employee.value = await fetchEmployeeById(props.id)
})

const fetchEmployeeById = async (id: string) => {
  try {
    const response = await getSingleEmployee(id)
    return response
  } catch (error) {
    console.error('Error fetching employee:', error)
    return null
  }
}
</script>
