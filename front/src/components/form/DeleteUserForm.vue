<template>
  <div class="w-[600px] h-[250px] p-6 space-y-6">
    <div>
      <h2 class="text-2xl">Ar tikrai norite ištrinti paskyrą?</h2>
    </div>
    <div class="space-y-4">
      <div class="space-y-2">
        <p class="text-text text-lg">
          {{
            props.user.name
              ? 'Paskyros vardas: ' + props.user.name
              : 'Paskyros slapyvardis: ' + props.user.username
          }}
        </p>
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
import type { User } from '@/types/users'
import { deleteUser } from '@/services/userService'
import { useNotificationStore } from '@/stores/Notification'
import { useUserStore } from '@/stores/Auth'
import { useRouter } from 'vue-router'

const emit = defineEmits(['update', 'close', 'updateCurrent', 'delete'])

const notificationStore = useNotificationStore()
const userStore = useUserStore()
const router = useRouter()

const props = defineProps<{
  user: User
}>()

const handleDelete = async () => {
  await userStore.refreshUser()
  if (userStore.permissions?.delete_permissions !== true) {
    notificationStore.addErrorNotification('Jūs neturite teisių ištrinti paskyrą', '')
    router.push('/')
    emit('close')
    return
  }
  try {
    const permissionId = props.user.permissions_id

    await deleteUser(props.user.id, permissionId)
    notificationStore.addSuccessNotification('Paskyra sėkmingai ištrinta')
    emit('update')
    emit('close')
  } catch (error) {
    notificationStore.addErrorNotification('Įvyko klaida ištrinant paskyrą', error)
  }
}
</script>
