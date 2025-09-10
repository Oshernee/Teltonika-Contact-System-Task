<template>
  <div class="rounded-lg border border-gray-200 p-4 shadow-sm">
    <div class="flex items-center mb-3">
      <div class="w-16 h-16 rounded-full flex items-center justify-center mr-3">
        <img
          v-if="props.employee.photo"
          :src="getPhotoUrl(props.employee.photo)"
          :alt="props.employee.name + ' ' + props.employee.surname"
          class="w-16 h-16 rounded-full object-cover"
        />
        <img v-else :src="Profile" class="w-16 h-16" alt="Profile" />
      </div>
      <div>
        <h3 class="font-semibold text-black">
          {{ props.employee.name + ' ' + props.employee.surname || 'Vardas ir pavardė' }}
        </h3>
        <p class="text-sm text-gray-500">
          Pozicija: {{ props.employee.position || 'Nėra duomenų' }}
        </p>
      </div>
    </div>

    <div class="space-y-1 text-sm text-text">
      <p>Telefono nr: {{ props.employee.phone_number || 'Nėra duomenų' }}</p>
      <p>El. paštas: {{ props.employee.email || 'Nėra duomenų' }}</p>
      <p>
        Adresas:
        {{
          props.employee.expand.office_id.street +
            ', ' +
            props.employee.expand.office_id.street_number +
            ', ' +
            props.employee.expand.office_id.city || 'Nėra duomenų'
        }}
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Employee } from '../types/employees'

import Profile from '../assets/Profile.svg'

const props = defineProps<{
  employee: Employee
}>()

function getPhotoUrl(photo: string | File | undefined): string | undefined {
  if (!photo) return undefined
  if (typeof photo === 'string') return photo
  return URL.createObjectURL(photo)
}
</script>
