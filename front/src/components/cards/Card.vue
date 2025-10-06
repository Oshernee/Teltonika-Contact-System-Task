<template>
  <div
    class="rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-xl hover:border-gray-300 transition-all duration-200 cursor-pointer overflow-auto"
    @click="pushToDetailedView"
  >
    <div class="flex items-center mb-3">
      <div class="w-16 h-16 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
        <img
          v-if="props.employee.photo"
          :src="getPhotoUrl(props.employee.photo, imageAPI)"
          :alt="props.employee.name + ' ' + props.employee.surname"
          class="w-12 h-12 rounded-full object-cover"
        />
        <img v-else :src="Profile" class="w-16 h-16" alt="Profile" />
      </div>
      <div class="min-w-0 flex-1">
        <h3 class="font-semibold text-black truncate">
          {{ props.employee.name + ' ' + props.employee.surname }}
        </h3>
        <p class="text-sm text-gray-500 truncate">Pozicija: {{ props.employee.position }}</p>
      </div>
    </div>

    <div class="space-y-1 text-sm text-text">
      <p>Telefono nr: {{ props.employee.phone_number || 'Nėra duomenų' }}</p>
      <p>El. paštas: {{ props.employee.email }}</p>
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
    <div class="flex justify-start mt-4 gap-2">
      <button
        v-if="props.permissions.edit_employees"
        @click.stop="emit('openEditModal', props.employee)"
        class="w-12 h-12 mr-2 bg-secondary rounded-full justify-center items-center flex"
      >
        <img :src="Edit" alt="Edit" class="w-8 h-8" />
      </button>
      <button
        v-if="props.permissions.delete_employees"
        @click.stop="emit('openDeleteModal', props.employee)"
        class="w-12 h-12 mr-2 bg-primary rounded-full justify-center items-center flex"
      >
        <img :src="Delete" alt="Edit" class="w-8 h-8" />
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

import type { Employee } from '@/types/employees'

import Profile from '@/assets/Profile.svg'
import Edit from '@/assets/Edit.svg'
import Delete from '@/assets/Delete.svg'

import { getPhotoUrl } from '@/utils/photoUtils'

import { DEFAULT_CONSTANTS } from '@/constants/defaultConstants'

const router = useRouter()

const emit = defineEmits(['openEditModal', 'openDeleteModal'])

const imageAPI = computed(() => {
  return DEFAULT_CONSTANTS.EMPLOYEE_IMAGE_API + props.employee.id
})

const props = defineProps<{
  employee: Employee
  permissions: {
    edit_employees: boolean
    delete_employees: boolean
  }
}>()

const pushToDetailedView = () => {
  router.push({ name: 'SingleContact', params: { id: props.employee.id } })
}
</script>
