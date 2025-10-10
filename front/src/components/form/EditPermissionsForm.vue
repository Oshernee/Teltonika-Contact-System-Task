<template>
  <div class="w-[500px] h-[750px] p-6 space-y-6 flex flex-col items-center relative">
    <div>
      <h2 class="text-3xl">Redaguoti paskyros teises:</h2>
    </div>
    <div class="space-y-4 pt-16 text-lg">
      <text class="text-xl"> Administracinės teisės: </text>
    </div>
    <div class="flex flex-col items-start gap-4">
      <Checkbox
        label="Redaguoti ir kurti kontaktus"
        :modelValue="permissions.edit_employees"
        @update:modelValue="(val) => (permissions.edit_employees = val)"
      />
      <Checkbox
        label="Trinti kontaktus"
        :modelValue="permissions.delete_employees"
        @update:modelValue="(val) => (permissions.delete_employees = val)"
      />
      <Checkbox
        label="Redaguoti ir kurti įmones"
        :modelValue="permissions.edit_companies"
        @update:modelValue="(val) => (permissions.edit_companies = val)"
      />
      <Checkbox
        label="Trinti įmones"
        :modelValue="permissions.delete_companies"
        @update:modelValue="(val) => (permissions.delete_companies = val)"
      />
      <Checkbox
        label="Redaguoti ir kurti ofisus"
        :modelValue="permissions.edit_offices"
        @update:modelValue="(val) => (permissions.edit_offices = val)"
      />
      <Checkbox
        label="Trinti ofisus"
        :modelValue="permissions.delete_offices"
        @update:modelValue="(val) => (permissions.delete_offices = val)"
      />
      <Checkbox label="Redaguoti ir kurti struktūras" v-model="permissions.edit_structure" />
      <Checkbox label="Trinti struktūrą" v-model="permissions.delete_structure" />
    </div>
    <div class="absolute bottom-4 right-4">
      <button
        @click="handleUpdate"
        class="w-32 bg-secondary text-white py-2 px-4 rounded-md font-medium hover:bg-blue-700 transition-colors"
      >
        ATNAUJINTI
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { User } from '@/types/users'
import type { UserPermission } from '@/types/user_permissions'
import { updateUserPermissions } from '@/services/userService'
import { useNotificationStore } from '@/stores/Notification'
import { useUserStore } from '@/stores/Auth'

import Checkbox from '@/components/ui/Checkbox.vue'
import { ref } from 'vue'

const emit = defineEmits(['update', 'close', 'updateCurrent', 'delete'])

const notificationStore = useNotificationStore()
const userStore = useUserStore()

const props = defineProps<{
  user: User
  permissions: UserPermission
}>()

const permissions = ref({
  edit_employees: props.permissions.edit_employees,
  delete_employees: props.permissions.delete_employees,
  edit_offices: props.permissions.edit_offices,
  delete_offices: props.permissions.delete_offices,
  edit_structure: props.permissions.edit_structure,
  delete_structure: props.permissions.delete_structure,
  edit_companies: props.permissions.edit_companies,
  delete_companies: props.permissions.delete_companies,
})

const handleUpdate = async () => {
  await userStore.refreshUser()
  if (userStore.permissions?.edit_permissions !== true) {
    notificationStore.addErrorNotification('Jūs neturite teisių redaguoti paskyrą', '')
    emit('close')
    return
  }
  try {
    await updateUserPermissions(props.user.permissions_id, permissions.value)
    notificationStore.addSuccessNotification('Paskyra sėkmingai atnaujinta')
    emit('update')
    emit('close')
  } catch (error) {
    notificationStore.addErrorNotification('Įvyko klaida atnaujinant paskyrą', error)
  }
}
</script>
