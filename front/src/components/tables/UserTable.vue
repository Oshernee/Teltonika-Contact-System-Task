<template>
  <div class="overflow-x-auto w-full">
    <table class="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
      <thead class="bg-gray-50">
        <tr>
          <th
            class="px-6 py-3 text-left text-md font-medium text-black tracking-wider border-b border-gray-200 w-[45%]"
          >
            Vardas
          </th>
          <th
            class="px-6 py-3 text-left text-md font-medium text-black tracking-wider border-b border-gray-200 w-[65%]"
          >
            El. paštas
          </th>
          <th
            v-if="props.permissions.edit || props.permissions.delete"
            class="px-6 py-3 text-center text-md font-medium text-black tracking-wider border-b border-gray-200 w-[100%]"
          >
            Veiksmas
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr
          v-for="user in props.users"
          :key="user.id"
          class="transition-colors duration-150 cursor-pointer"
        >
          <td class="px-6 py-4 whitespace-nowrap text-md text-gray-900 text-start font-light">
            {{ user.name }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-md text-gray-900 text-start font-light">
            {{ user.email }}
          </td>
          <td
            class="px-6 py-4 flex gap-2 w-full justify-center"
            v-if="(props.permissions.edit || props.permissions.delete) && user.id !== userId"
          >
            <button
              v-if="props.permissions.edit"
              @click.stop="emit('openEditPermissionsModal', user)"
              class="bg-accent w-[40%] px-16"
              :class="buttonClass"
            >
              Keisti leidimus
            </button>
            <button
              v-if="props.permissions.edit"
              @click.stop="emit('openEditUserModal', user)"
              class="bg-accent w-[35%] px-12"
              :class="buttonClass"
            >
              Modifikuoti
            </button>
            <button
              v-if="props.permissions.delete"
              @click.stop="emit('openDeleteModal', user)"
              class="bg-primary w-[25%] px-8"
              :class="buttonClass"
            >
              Ištrinti
            </button>
          </td>
          <td
            v-else
            class="px-6 py-4 whitespace-nowrap text-md text-center text-gray-900 font-light"
          >
            Jūs negalite modifikuoti savo paskyros.
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps } from 'vue'
import type { User } from '@/types/users'
import { useUserStore } from '@/stores/Auth'

const userStore = useUserStore()
const userId = computed(() => userStore.user?.id)

const buttonClass =
  'h-12 mr-2 rounded-full justify-center items-center flex text-white hover:opacity-90 text-lg whitespace-nowrap'

const props = defineProps<{
  users: User[]
  permissions: {
    edit: boolean
    delete: boolean
  }
}>()

const emit = defineEmits(['openEditUserModal', 'openEditPermissionsModal', 'openDeleteModal'])
</script>
