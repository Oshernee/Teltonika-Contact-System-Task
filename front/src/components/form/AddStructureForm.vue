<template>
  <div class="w-[800px]">
    <div class="p-6">
      <h1 class="text-3xl">Pridėti naują {{ props.constants.type_accusative }}:</h1>
    </div>

    <div class="grid grid-cols-2 gap-6 px-6 pb-6">
      <div>
        <h1 class="text-xl mb-2">{{ props.constants.type_genitive }} pavadinimas:</h1>
        <input
          maxlength="255"
          :placeholder="'Įveskite ' + props.constants.type_genitive.toLowerCase() + ' pavadinimą'"
          type="text"
          class="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          :class="{ 'border-red-500': nameError }"
          @input="updateValues(($event.target as HTMLInputElement).value)"
        />
        <p v-if="nameError" class="text-red-500 text-sm mt-1">{{ nameError }}</p>
      </div>

      <div>
        <UpperStructureSelector
          :structures="props.upperStructures"
          :upperStructureType="props.constants.upper_structure_type_plural"
          v-model="selectedUpperStructureId"
          @update:model-value="(value) => (selectedUpperStructureId = value)"
        />
      </div>

      <div class="col-span-2 flex justify-start">
        <button
          @click="handleAddStructure"
          class="w-72 mt-6 bg-blue-600 text-white py-4 px-4 rounded-md font-medium hover:bg-blue-700 transition-colors"
        >
          PRIDĖTI
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import { validateStructureName } from '@/utils/validateInputs'

import { createStructure, isStructureNameUnique } from '@/services/universalService'

import { useNotificationStore } from '@/stores/Notification'
import { useUserStore } from '@/stores/Auth'
import UpperStructureSelector from '../ui/UpperStructureSelector.vue'

const notificationStore = useNotificationStore()
const userStore = useUserStore()

const emit = defineEmits(['update', 'close', 'updateCurrent', 'delete'])

let name = ''
const selectedUpperStructureId = ref<string[]>([])

const nameError = ref<string | null>(null)

const updateValues = (newName: string) => {
  name = newName
}

const props = defineProps<{
  constants: {
    type_accusative: string
    type_genitive: string
    upper_structure_type_plural: string
    structure_type: string
    upper_structure_type: string
  }
  upperStructures: { id: string; name: string }[]
}>()

const validateFields = async () => {
  nameError.value = validateStructureName(name.trim())
  if (nameError.value) {
    return false
  }
  return true
}

const handleAddStructure = async () => {
  const isNameUnique = await isStructureNameUnique(name.trim(), props.constants.structure_type)
  if (!isNameUnique) {
    nameError.value = 'Toks pavadinimas jau egzistuoja'
    return
  }

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
    await createStructure(
      props.constants.structure_type,
      name.trim(),
      selectedUpperStructureId.value,
      props.constants.upper_structure_type
    )

    notificationStore.addSuccessNotification(
      props.constants.type_genitive + ' įrašas sėkmingai pridėtas'
    )

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
