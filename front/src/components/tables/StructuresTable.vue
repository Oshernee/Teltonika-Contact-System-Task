<template>
  <div class="overflow-x-auto w-full">
    <table class="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
      <thead class="bg-gray-50">
        <tr>
          <th
            class="px-6 py-3 text-left text-md font-medium text-black tracking-wider border-b border-gray-200 w-[32.5%]"
          >
            Pavadinimas
          </th>
          <th
            class="px-6 py-3 text-left text-md font-medium text-black tracking-wider border-b border-gray-200 w-[32.5%]"
            v-if="props.structureType === 'offices'"
          >
            Adresas
          </th>
          <th
            v-if="props.permissions.edit || props.permissions.delete"
            class="px-6 py-3 text-center text-md font-medium text-black tracking-wider border-b border-gray-200 w-[35%]"
          >
            Veiksmas
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr
          v-for="structure in props.structures"
          :key="structure.id"
          class="transition-colors duration-150 cursor-pointer"
        >
          <td
            class="px-6 py-4 whitespace-nowrap text-md text-gray-900 text-start font-light w-[32.5%]"
          >
            {{ structure.name }}
          </td>
          <td
            v-if="props.structureType === 'offices'"
            class="px-6 py-4 whitespace-nowrap text-md text-gray-900 text-start font-light w-[32.5%]"
          >
            {{ structure.street }} {{ structure.street_number }}, {{ structure.city }},
            {{ structure.country }}
          </td>
          <td class="px-6 py-4 w-[35%]" v-if="props.permissions.edit || props.permissions.delete">
            <div class="flex justify-center items-center gap-2">
              <button
                v-if="props.permissions.edit"
                @click.stop="emit('openEditModal', structure)"
                class="bg-accent px-16"
                :class="buttonClass"
              >
                Redaguoti
              </button>
              <button
                v-if="props.permissions.delete"
                @click.stop="emit('openDeleteModal', structure)"
                class="bg-primary px-8"
                :class="buttonClass"
              >
                Ištrinti
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

const buttonClass = 'h-12 rounded-full flex items-center text-white hover:opacity-90 text-lg'

const props = defineProps<{
  structures: any[]
  structureType: string
  permissions: {
    edit: boolean
    delete: boolean
  }
}>()

const emit = defineEmits(['openEditModal', 'openDeleteModal'])
</script>
