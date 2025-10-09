<template>
  <div class="w-[800px]">
    <div class="p-6">
      <h1 class="text-3xl">Redaguoti {{ props.constants.type_accusative }}:</h1>
    </div>

    <div class="grid grid-cols-2 gap-6 px-6 pb-6">
      <OfficeInputFields @update:values="updateValues($event)" :office="office" :errors="errors" />

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
          @click="handleAddStructure"
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

import {
  validateOfficeName,
  validateOfficeStreet,
  validateOfficeStreetNumber,
  validateOfficeCity,
  validateOfficeCountry,
} from '@/utils/validateInputs'

import { updateOffice } from '@/services/officeService'
import { isStructureNameUnique } from '@/services/universalService'

import { useNotificationStore } from '@/stores/Notification'
import { useUserStore } from '@/stores/Auth'
import UpperStructureSelector from '../ui/UpperStructureSelector.vue'
import OfficeInputFields from '../ui/OfficeInputFields.vue'
import type { Structure } from '@/types/structures'

const notificationStore = useNotificationStore()
const userStore = useUserStore()

const emit = defineEmits(['update', 'close', 'updateCurrent', 'delete'])

const updated = ref(false)
const updatedName = ref(false)

const errors = ref({
  name: '',
  street: '',
  street_number: '',
  city: '',
  country: '',
})

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

const office = ref({
  name: props.structure?.name || '',
  street: props.structure?.street || '',
  street_number: props.structure?.street_number || '',
  city: props.structure?.city || '',
  country: props.structure?.country || '',
})

const selectedUpperStructures = ref(
  props.selectedUpperStructure.map(
    (structure) =>
      (structure as Record<string, string>)[
        props.constants.upper_structure_type.slice(0, -3) + 'y_id'
      ]
  )
)

const updateValues = (newValues: typeof office.value) => {
  if (newValues.name !== office.value.name) updatedName.value = true
  office.value = newValues
}

const validateFields = async () => {
  errors.value.name = validateOfficeName(office.value.name)
  errors.value.street = validateOfficeStreet(office.value.street)
  errors.value.street_number = validateOfficeStreetNumber(office.value.street_number)
  errors.value.city = validateOfficeCity(office.value.city)
  errors.value.country = validateOfficeCountry(office.value.country)

  if (
    errors.value.name ||
    errors.value.street ||
    errors.value.street_number ||
    errors.value.city ||
    errors.value.country
  ) {
    return false
  }
  return true
}

const handleAddStructure = async () => {
  const isValid = await validateFields()
  if (!isValid) {
    return
  }

  if (updatedName.value) {
    const isNameUnique = await isStructureNameUnique(office.value.name.trim(), 'offices')
    if (!isNameUnique) {
      errors.value.name = 'Toks ofiso pavadinimas jau egzistuoja'
      return
    }
  }

  try {
    await userStore.refreshUser()
    if (userStore.permissions?.edit_structure !== true) {
      notificationStore.addErrorNotification(
        'Jūs neturite teisių atnaujinti ' + props.constants.type_accusative,
        ''
      )
      emit('close')
      return
    }
    await updateOffice(
      props.constants.structure_type,
      props.structure.id,
      {
        name: office.value.name.trim(),
        street: office.value.street.trim(),
        street_number: office.value.street_number.trim(),
        city: office.value.city.trim(),
        country: office.value.country.trim(),
      },
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
      'Nepavyko pridėti ' + props.constants.type_genitive.toLowerCase(),
      error
    )
  }
}
</script>
