<template>
  <div class="w-[600px] h-[250px]">
    <div class="p-6">
      <h1 class="text-3xl">Pridėti naują {{ props.constants.type_accusative }}:</h1>
    </div>

    <div class="w-1/2 pl-6">
      <h1 class="text-xl mb-2">{{ props.constants.type_genitive }} pavadinimas:</h1>
      <input
        :placeholder="'Įveskite ' + props.constants.type_genitive.toLowerCase() + ' pavadinimą'"
        type="text"
        class="w-72 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        :class="{ 'border-red-500': nameError }"
        @input="updateValues(($event.target as HTMLInputElement).value)"
      />

      <button
        @click="handleAddStructure"
        class="w-72 mt-6 bg-blue-600 text-white py-4 px-4 rounded-md font-medium hover:bg-blue-700 transition-colors"
      >
        PRIDĖTI
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import { validateStructureName } from '@/utils/validateInputs'

import { createStructure } from '@/services/universalService'

import { useNotificationStore } from '@/stores/Notification'
import { useUserStore } from '@/stores/Auth'

const notificationStore = useNotificationStore()
const userStore = useUserStore()

const emit = defineEmits(['update', 'close', 'updateCurrent', 'delete'])

let name = ''

const nameError = ref<string | null>(null)

const updateValues = (newName: string) => {
  name = newName
}

const props = defineProps<{
  constants: {
    type_accusative: string
    type_genitive: string
    structure_type: string
  }
}>()

const validateFields = async () => {
  nameError.value = validateStructureName(name)
  if (nameError.value) {
    return false
  }
  return true
}

const handleAddStructure = async () => {
  const isValid = await validateFields()
  if (!isValid) {
    return
  }
  try {
    await userStore.refreshUser()
    if (userStore.permissions?.edit_structure !== true) {
      notificationStore.addErrorNotification(
        'Jūs neturite teisių sukurti ' + props.constants.type_accusative,
        ''
      )
      emit('close')
      return
    }
    await createStructure(props.constants.structure_type, name.trim())

    notificationStore.addSuccessNotification(props.constants.type_genitive + ' sėkmingai pridėtas')

    emit('update')
    emit('close')
  } catch (error) {
    notificationStore.addErrorNotification(
      'Nepavyko pridėti ' + props.constants.type_genitive.toLowerCase(),
      error
    )
  }
}
</script>
