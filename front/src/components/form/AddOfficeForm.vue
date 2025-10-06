<template>
  <div class="w-[800px]">
    <div class="p-6">
      <h1 class="text-3xl">Pridėti naują {{ props.constants.type_accusative }}:</h1>
    </div>

    <div class="grid grid-cols-2 gap-6 px-6 pb-6">
      <OfficeInputFields @update:values="updateValues($event)" :office="office" :errors="errors" />

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

import {
  validateOfficeName,
  validateOfficeStreet,
  validateOfficeStreetNumber,
  validateOfficeCity,
  validateOfficeCountry,
} from '@/utils/validateInputs'

import { createOffice } from '@/services/officeService'
import { isStructureNameUnique } from '@/services/universalService'

import { useNotificationStore } from '@/stores/Notification'
import { useUserStore } from '@/stores/Auth'
import UpperStructureSelector from '../ui/UpperStructureSelector.vue'
import OfficeInputFields from '../ui/OfficeInputFields.vue'

const notificationStore = useNotificationStore()
const userStore = useUserStore()

const emit = defineEmits(['update', 'close', 'updateCurrent', 'delete'])

const office = ref({
  name: '',
  street: '',
  street_number: '',
  city: '',
  country: '',
})

const selectedUpperStructureId = ref<string[]>([])

const errors = ref({
  name: '',
  street: '',
  street_number: '',
  city: '',
  country: '',
})

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

const updateValues = (newValues: typeof office.value) => {
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
  try {
    const isNameUnique = await isStructureNameUnique(office.value.name.trim(), 'offices')
    if (!isNameUnique) {
      errors.value.name = 'Toks pavadinimas jau egzistuoja'
      return
    }

    const isValid = await validateFields()
    if (!isValid) {
      return
    }

    await userStore.refreshUser()
    if (userStore.permissions?.edit_structure !== true) {
      notificationStore.addErrorNotification(
        'Jūs neturite teisių sukurti ' + props.constants.type_accusative,
        ''
      )
      emit('close')
      return
    }
    await createOffice(
      props.constants.structure_type,
      office.value.street.trim(),
      office.value.street_number.trim(),
      office.value.city.trim(),
      office.value.country.trim(),
      office.value.name.trim(),
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
