<template>
  <div class="w-[600px] h-[250px]">
    <div class="p-6">
      <h1 class="text-3xl">Redaguoti {{ props.constants.type_accusative }}:</h1>
    </div>

    <div class="w-1/2 pl-6">
      <h1 class="text-xl mb-2">{{ props.constants.type_genitive }} pavadinimas:</h1>
      <input
        type="text"
        class="w-72 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        :class="{ 'border-red-500': nameError }"
        v-model="name"
      />
      <p v-if="nameError" class="text-red-500 mt-1">{{ nameError }}</p>

      <button
        @click="handleUpdateStructure"
        class="w-72 mt-6 bg-blue-600 text-white py-4 px-4 rounded-md font-medium hover:bg-blue-700 transition-colors"
      >
        REDAGUOTI
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'

import { validateName } from '@/utils/validateInputs'

import { updateStructure } from '@/services/universalService'

import { useNotificationStore } from '@/stores/Notification'
import { useUserStore } from '@/stores/Auth'

const notificationStore = useNotificationStore()
const userStore = useUserStore()

const emit = defineEmits(['update', 'close', 'updateCurrent', 'delete'])

const props = defineProps<{
  structure: Structure
  constants: {
    type_accusative: string
    type_genitive: string
    structure_type: string
  }
}>()

let name = ref(props.structure.name)

const nameError = ref<string | null>(null)

const validateFields = async () => {
  nameError.value = validateName(name.value)
  if (nameError.value) {
    return false
  }
  return true
}

const handleUpdateStructure = async () => {
  const isValid = await validateFields()
  if (!isValid) {
    return
  }
  await userStore.refreshUser()
  const permission = 'edit_' + props.constants.structure_type
  if (userStore.permissions?.[permission] !== true) {
    notificationStore.addErrorNotification(
      'Jūs neturite teisių atnaujinti ' + props.constants.type_accusative,
      ''
    )
    emit('close')
    return
  }

  try {
    await updateStructure(props.constants.structure_type, props.structure.id, name.value.trim())

    notificationStore.addSuccessNotification(
      props.constants.type_genitive + ' sėkmingai atnaujintas'
    )

    emit('update')
    emit('close')
  } catch (error) {
    console.log(error)
    notificationStore.addErrorNotification(
      'Nepavyko atnaujinti ' + props.constants.type_genitive.toLowerCase(),
      error
    )
  }
}
</script>
