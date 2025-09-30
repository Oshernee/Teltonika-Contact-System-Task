<template>
  <div class="w-[600px] h-[250px] p-6 space-y-6">
    <div>
      <h2 class="text-2xl">Ar tikrai norite ištrinti šį kontaktą?</h2>
    </div>
    <div class="space-y-4">
      <div class="space-y-2">
        <p class="text-text text-lg">
          Vardas ir pavardė: {{ props.employee.name }} {{ props.employee.surname }}
        </p>
        <p class="text-text text-lg">Pozicija: {{ props.employee.position }}</p>
      </div>
    </div>
    <div class="flex justify-end pt-10 gap-4">
      <button class="px-4 py-2 text-secondary font-bold text-2xl" @click="emit('close')">Ne</button>
      <button class="px-4 py-2 text-secondary font-bold text-2xl" @click="handleDelete">
        Taip
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Employee } from '@/types/employees'
import { deleteRecordById } from '@/services/universalService'
import { useNotificationStore } from '@/stores/Notification'
import { useUserStore } from '@/stores/Auth'

const emit = defineEmits(['update', 'close', 'updateCurrent', 'delete'])
const notificationStore = useNotificationStore()
const userStore = useUserStore()

const props = defineProps<{
  employee: Employee
}>()

const handleDelete = async () => {
  try {
    userStore.refreshUser()
    if (userStore.permissions?.delete_employees !== true) {
      notificationStore.addErrorNotification('Jūs neturite teisių ištrinti kontaktą', '')
      emit('close')
      return
    }
    await deleteRecordById('employees', props.employee.id)
    notificationStore.addSuccessNotification('Kontaktas sėkmingai ištrintas')
    emit('update')
    emit('close')
  } catch (error) {
    notificationStore.addErrorNotification('Nepavyko ištrinti kontakto', error)
  }
}
</script>
