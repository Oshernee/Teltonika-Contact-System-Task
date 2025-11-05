<template>
  <div class="w-[800px]">
    <div class="p-6">
      <h1 class="text-3xl">Redaguoti naują {{ props.constants.type_accusative }}:</h1>
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
          v-model="name"
        />
        <p v-if="nameError" class="text-red-500 text-sm mt-1">{{ nameError }}</p>
      </div>

      <div>
        <UpperStructureSelector
          :structures="props.upperStructures"
          :upperStructureType="props.constants.upper_structure_type_plural"
          :modelValue="selectedUpperStructures"
          @update:model-value="(value) => (selectedUpperStructures = value) && (updated = true)"
        />
      </div>

      <div class="col-span-2 flex justify-start">
        <button
          @click="handleUpdateStructure"
          class="w-72 mt-6 bg-blue-600 text-white py-4 px-4 rounded-md font-medium hover:bg-blue-700 transition-colors"
        >
          REDAGUOTI
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import { validateStructureName } from '@/utils/validateInputs'

import { updateStructure, isStructureNameUnique } from '@/services/universalService'

import { useNotificationStore } from '@/stores/Notification'
import { useUserStore } from '@/stores/Auth'

import type { Structure } from '@/types/structures'

import UpperStructureSelector from '../ui/UpperStructureSelector.vue'

const updated = ref(false)
const notificationStore = useNotificationStore()
const userStore = useUserStore()

const emit = defineEmits(['update', 'close', 'updateCurrent', 'delete'])

const props = defineProps<{
  structure: Structure
  selectedUpperStructure: Structure[]
  constants: {
    type_accusative: string
    type_genitive: string
    upper_structure_type_plural: string
    structure_type: string
    upper_structure_type: string
  }
  upperStructures: { id: string; name: string }[]
}>()

const name = ref(props.structure.name)
const selectedUpperStructures = ref(
  props.selectedUpperStructure.map(
    (structure) =>
      (structure as Record<string, string>)[
        props.constants.upper_structure_type.slice(0, -1) + '_id'
      ]
  )
)

const nameError = ref<string | null>(null)

const validateFields = async () => {
  nameError.value = validateStructureName(name.value.trim())
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

  try {
    if (name.value.trim() !== props.structure.name) {
      const isNameUnique = await isStructureNameUnique(
        name.value.trim(),
        props.constants.structure_type
      )
      if (!isNameUnique) {
        nameError.value = 'Toks pavadinimas jau egzistuoja'
        return
      }
    }

    await userStore.refreshUser()
    if (userStore.permissions?.edit_structure !== true) {
      notificationStore.addErrorNotification(
        'Jūs neturite teisių atnaujinti ' + props.constants.type_accusative,
        ''
      )
      emit('close')
      return
    }

    if (!updated.value && name.value.trim() === props.structure.name) {
      notificationStore.addInfoNotification('Nėra ką atnaujinti')
      emit('close')
      return
    }

    if (selectedUpperStructures.value.length === 0) {
      notificationStore.addErrorNotification(
        'Pasirinkite ' + props.constants.type_accusative.toLowerCase(),
        ''
      )
      return
    }
    await updateStructure(
      props.constants.structure_type,
      props.structure.id,
      name.value.trim(),
      selectedUpperStructures.value,
      props.constants.upper_structure_type
    )

    notificationStore.addSuccessNotification(
      props.constants.type_genitive + ' įrašas sėkmingai atnaujintas'
    )

    emit('update')
    emit('close')
  } catch (error) {
    notificationStore.addErrorNotification(
      'Nepavyko atnaujinti ' + props.constants.type_genitive.toLowerCase(),
      error
    )
  }
}
</script>
