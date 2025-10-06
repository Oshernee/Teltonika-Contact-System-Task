<template>
  <div class="overflow-x-auto w-full">
    <table class="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
      <thead class="bg-gray-50">
        <tr>
          <th
            class="px-6 py-3 text-left text-md font-medium text-black uppercase tracking-wider border-b border-gray-200"
          >
            Vardas ir pavardė
          </th>
          <th
            class="px-6 py-3 text-left text-md font-medium text-black uppercase tracking-wider border-b border-gray-200"
          >
            Pozicija
          </th>
          <th
            class="px-6 py-3 text-left text-md font-medium text-black uppercase tracking-wider border-b border-gray-200"
          >
            Telefono numeris
          </th>
          <th
            class="px-6 py-3 text-left text-md font-medium text-black uppercase tracking-wider border-b border-gray-200"
          >
            Elektroninis paštas
          </th>
          <th
            class="px-6 py-3 text-left text-md font-medium text-black uppercase tracking-wider border-b border-gray-200"
          >
            Adresas
          </th>
          <th
            v-if="props.permissions.edit_employees || props.permissions.delete_employees"
            class="px-6 py-3 text-left text-md font-medium text-black uppercase tracking-wider border-b border-gray-200"
          >
            Veiksmas
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr
          v-for="employee in props.employees"
          :key="employee.id"
          class="hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
          @click="pushToDetailedView(employee)"
        >
          <td class="px-6 py-4 whitespace-nowrap text-md text-gray-900">
            {{ employee.name }} {{ employee.surname }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-md text-gray-900">
            {{ employee.position }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-md text-gray-900">
            {{ employee.phone_number }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-md text-gray-900">
            {{ employee.email }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-md text-gray-900">
            {{
              employee.expand?.office_id
                ? `${employee.expand.office_id.street}, ${employee.expand.office_id.street_number}, ${employee.expand.office_id.city}`
                : 'Nėra duomenų'
            }}
          </td>
          <td
            class="px-6 py-4 flex gap-2"
            v-if="props.permissions.edit_employees || props.permissions.delete_employees"
          >
            <button
              v-if="props.permissions.edit_employees"
              @click.stop="emit('openEditModal', employee)"
              class="w-12 h-12 mr-2 bg-secondary rounded-full justify-center items-center flex"
            >
              <img :src="Edit" alt="Edit" class="w-8 h-8" />
            </button>
            <button
              v-if="props.permissions.delete_employees"
              @click.stop="emit('openDeleteModal', employee)"
              class="w-12 h-12 mr-2 bg-primary rounded-full justify-center items-center flex"
            >
              <img :src="Delete" alt="Edit" class="w-8 h-8" />
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import type { Employee } from '@/types/employees'

import { useRouter } from 'vue-router'

import Edit from '@/assets/Edit.svg'
import Delete from '@/assets/Delete.svg'

const router = useRouter()

const emit = defineEmits(['openEditModal', 'openDeleteModal'])

const props = defineProps<{
  employees: Employee[]
  permissions: {
    edit_employees: boolean
    delete_employees: boolean
  }
}>()

const pushToDetailedView = (employee: Employee) => {
  router.push({ name: 'SingleContact', params: { id: employee.id } })
}
</script>
