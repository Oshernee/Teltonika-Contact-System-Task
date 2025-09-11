<template>
  <div
    v-if="employee"
    class="mx-16 my-4 bg-white text-left font-extralight flex flex-col items-start gap-4"
  >
    <text class="text-[56px] text-text font-thin">Detalesnė kontaktų informacija</text>
    <div class="flex flex-row items-center">
      <div class="w-24 h-24 rounded-full flex items-center justify-center mr-3">
        <img
          v-if="employee.photo"
          :src="getPhotoUrl(employee.photo)"
          :alt="employee.name + ' ' + employee.surname"
          class="w-24 h-24 rounded-full object-cover"
        />
        <img v-else :src="Profile" class="w-24 h-24" alt="Profile" />
      </div>
      <div>
        <h3 class="font-normal text-black text-5xl">
          {{ employee.name + ' ' + employee.surname || 'Vardas ir pavardė' }}
        </h3>
        <p class="text-2xl font-thin text-gray-500">
          Pozicija: {{ employee.position || 'Nėra duomenų' }}
        </p>
      </div>
    </div>
    <div class="w-full grid grid-cols-1 md:grid-cols-2 gap-8 my-4">
      <!-- Kontaktinės detalės -->
      <div class="bg-gray-50 p-6 rounded-lg">
        <h4 class="text-xl font-medium text-black mb-4">Kontaktinės detalės:</h4>
        <div class="space-y-3">
          <div>
            <span class="text-gray-700">Elektroninis paštas: </span>
            <a :href="`mailto:${employee.email}`" class="text-blue-600 hover:underline">
              {{ employee.email || 'example@teltonika.lt' }}
            </a>
          </div>
          <div>
            <span class="text-gray-700">Telefono numeris: </span>
            <a :href="`tel:${employee.phone_number}`" class="text-blue-600 hover:underline">
              {{ employee.phone_number || '+00000000000' }}
            </a>
          </div>
        </div>
      </div>

      <!-- Kompanijos detalės -->
      <div class="bg-gray-50 p-6 rounded-lg">
        <h4 class="text-xl font-medium text-black mb-4">Kompanijos detalės:</h4>
        <div class="space-y-3">
          <div>
            <span class="text-gray-700">Kompanija: </span>
            <span class="text-gray-900">{{
              employee.expand.company_id.name || 'Trūksta duomenų'
            }}</span>
          </div>
          <div>
            <span class="text-gray-700">Būstinė: </span>
            <span class="text-gray-900">{{
              employee.expand.office_id.name || 'Trūksta duomenų'
            }}</span>
          </div>
          <div>
            <span class="text-gray-700">Padalinys: </span>
            <span class="text-gray-900">{{
              employee.expand.division_id.name || 'Trūksta duomenų'
            }}</span>
          </div>
          <div>
            <span class="text-gray-700">Skyrius: </span>
            <span v-if="employee.expand.department_id" class="text-gray-900">{{
              employee.expand.department_id.name
            }}</span>
            <span v-else class="text-gray-900">Neturi</span>
          </div>
          <div>
            <span class="text-gray-700">Grupė: </span>
            <span v-if="employee.expand.group_id" class="text-gray-900">{{
              employee.expand.group_id.name
            }}</span>
            <span v-else class="text-gray-900">Neturi</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else>Nėra duomenų (reiks redirectinti i 404)</div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

import { getSingleEmployee } from '../services/employeeService'
import { getPhotoUrl } from '../utils/photoUtils'

import Profile from '../assets/Profile.svg'

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
