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
              class="text-blue-600 hover:underline truncate block max-w-full"
            >
              {{ employee.email }}
            </a>
          </div>
          <div>
            <span class="text-text">Telefono numeris: </span>
            <a :href="phoneStyle.href" :class="[phoneStyle.class, 'truncate block max-w-full']">
              {{ employee.phone_number ? employee.phone_number : '-' }}
            </a>
          </div>
        </div>
      </div>
      <div class="px-6 py-8 rounded-lg">
        <div class="w-full border-b border-gray-200 pb-4 mb-6">
          <h4 class="text-2xl font-medium text-black">Kompanijos detalės:</h4>
        </div>
        <div class="space-y-6 text-xl">
          <div>
            <span :class="classes.labelClass">Kompanija: </span>
            <span :class="classes.textClass">{{ employee.expand.company_id.name }}</span>
          </div>
          <div>
            <span :class="classes.labelClass">Būstinė: </span>
            <span :class="classes.textClass">{{ employee.expand.office_id.name }}</span>
          </div>
          <div>
            <span :class="classes.labelClass">Padalinys: </span>
            <span :class="classes.textClass">{{ employee.expand.division_id.name }}</span>
          </div>
          <div>
            <span :class="classes.labelClass">Skyrius: </span>
            <span :class="classes.textClass">{{
              employee.expand.department_id ? employee.expand.department_id.name : '-'
            }}</span>
          </div>
          <div>
            <span :class="classes.labelClass">Grupė:</span>
            <span :class="classes.textClass">{{
              employee.expand.group_id ? employee.expand.group_id.name : '-'
            }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import type { Employee } from '../types/employees'

const classes = { labelClass: 'text-text', textClass: 'text-gray-900 truncate block max-w-full' }

const props = defineProps<{
  employee: Employee
}>()

const phoneStyle = reactive({
  href: `tel:${props.employee.phone_number}`,
  class: props.employee.phone_number ? 'text-blue-600 hover:underline' : 'text-gray-900',
})
</script>
