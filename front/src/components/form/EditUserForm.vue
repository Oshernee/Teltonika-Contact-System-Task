<template>
  <div class="w-[500px] h-[750px] p-6 space-y-6 flex flex-col items-center relative">
    <div>
      <h2 class="text-3xl">Redaguoti paskyrą:</h2>
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
import { updateUser } from '@/services/userService'
import { useNotificationStore } from '@/stores/Notification'
import { useUserStore } from '@/stores/Auth'

import { ref } from 'vue'

const emit = defineEmits(['update', 'close', 'updateCurrent', 'delete'])

const notificationStore = useNotificationStore()
const userStore = useUserStore()

const props = defineProps<{
  user: User
}>()

const userInfo = ref({
  name: props.user.name,
  email: props.user.email,
  avatar: props.user.avatar,
})

const handleUpdate = async () => {
  await userStore.refreshUser()
  if (userStore.permissions?.edit_permissions !== true) {
    notificationStore.addErrorNotification('Jūs neturite teisių redaguoti paskyrą', '')
    emit('close')
    return
  }
  try {
    await updateUser(props.user.id, userInfo.value)
    notificationStore.addSuccessNotification('Paskyra sėkmingai atnaujinta')
    emit('update')
    emit('close')
  } catch (error) {
    notificationStore.addErrorNotification('Įvyko klaida atnaujinant paskyrą', error)
  }
}
</script>
