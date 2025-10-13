<template>
  <div class="w-full bg-white rounded-3xl shadow-md p-6 border border-gray-200">
    <div class="w-full grid grid-cols-1 md:grid-cols-2 my-4 justify-center">
      <div class="px-6 py-8 rounded-lg">
        <div class="w-full border-b border-gray-200 pb-4 mb-6">
          <h4 class="text-2xl font-medium text-black">Kontaktinės detalės:</h4>
        </div>
        <div class="space-y-6 text-xl">
          <div>
            <span class="text-text">Elektroninis paštas: </span>
            <a
              :href="`mailto:${employee.email}`"
              class="text-blue-600 hover:underline overflow-auto"
            >
              {{ employee.email }}
            </a>
          </div>
          <div>
            <span class="text-text">Telefono numeris: </span>
            <a
              :href="`tel:${employee.phone_number}`"
              class="text-blue-600 hover:underline overflow-auto"
            >
              {{ employee.phone_number || '+00000000000' }}
            </a>
          </div>
        </div>
      </div>
      <div class="px-6 py-8 rounded-lg">
        <div class="w-full border-b border-gray-200 pb-4 mb-6">
          <h4 class="text-2xl font-medium text-black">Įmonės detalės:</h4>
        </div>
        <div class="space-y-6 text-xl overflow-auto">
          <div>
            <span class="text-text">Įmonė: </span>
            <span class="text-gray-900">{{ employee.expand.company_id.name }}</span>
          </div>
          <div>
            <span class="text-text">Būstinė: </span>
            <span class="text-gray-900">{{ employee.expand.office_id.name }}</span>
          </div>
          <div>
            <span class="text-text">Padalinys: </span>
            <span class="text-gray-900">{{ employee.expand.division_id.name }}</span>
          </div>
          <div>
            <span class="text-text">Skyrius: </span>
            <span v-if="employee.expand.department_id" class="text-gray-900">{{
              employee.expand.department_id.name
            }}</span>
            <span v-else class="text-gray-900">Neturi</span>
          </div>
          <div>
            <span class="text-text">Grupė: </span>
            <span v-if="employee.expand.group_id" class="text-gray-900">{{
              employee.expand.group_id.name
            }}</span>
            <span v-else class="text-gray-900">Neturi</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Employee } from '@/types/employees'

defineProps<{
  employee: Employee
}>()
</script>
