<template>
  <div class="w-[1200px] h-[700px]">
    <div class="p-6 space-x-6 flex flex-row">
      <div class="w-1/2 pr-6">
        <h1 class="text-3xl pl-6">Redaguoti kontaktą:</h1>
        <InputFields
          :error-messages="errorMessages"
          @update:model-value="updateValues"
          :startingValues="[
            props.employee.name,
            props.employee.surname,
            props.employee.position,
            props.employee.email,
            props.employee.phone_number || '',
          ]"
        />
      </div>

      <div class="w-1/2 pl-6">
        <h1 class="text-xl pl-6 mb-6">Įmonės detalės:</h1>

        <ItemSelector
          v-model="selectedIds"
          :is-error-necessary="true"
          :error-messages="errorMessages"
          :selectedIds="selectedIds"
          @update="updateIds"
        />

        <div class="pt-20">
          <label
            for="image-upload"
            class="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 transition-colors mb-2 cursor-pointer flex items-center justify-center gap-2"
          >
            ĮKELTI NUOTRAUKĄ
          </label>
          <input
            type="file"
            @change="uploadImage($event)"
            accept="image/*"
            class="hidden"
            id="image-upload"
          />
          <p class="text-sm text-gray-500 text-center mt-2">
            {{ image ? (image.name ? image.name : image) : 'Nuotrauka neįkelta. Maks. 5MB' }}
            <button v-if="image" @click="image = null" class="text-red-500 text-sm ml-2">x</button>
          </p>
          <div class="text-red-500 text-sm mt-1" v-if="errorMessages.image">
            {{ errorMessages.image }}
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="flex justify-end px-6 pb-6">
    <button
      @click="handleUpdateEmployee"
      class="w-72 bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 transition-colors"
    >
      ATNAUJINTI
    </button>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

import InputFields from '../ui/InputField.vue'
import ItemSelector from '../ui/ItemSelector.vue'

import {
  validateEmail,
  validatePhone,
  validateName,
  validateSurname,
  validatePosition,
} from '@/utils/validateInputs'

import { updateEmployee } from '@/services/employeeService'

import { useNotificationStore } from '@/stores/Notification'
import { useUserStore } from '@/stores/Auth'

import { handleImageUpload } from '@/utils/photoUtils'

import type { Employee } from '@/types/employees'

const props = defineProps<{
  employee: Employee
}>()

type TargetKey = 'company' | 'office' | 'division' | 'department' | 'group'
const notificationStore = useNotificationStore()
const userStore = useUserStore()

const emit = defineEmits(['update', 'close', 'updateCurrent', 'delete'])

const name = ref(props.employee.name)
const surname = ref(props.employee.surname)
const position = ref(props.employee.position)
const email = ref(props.employee.email)
const phone = ref(props.employee.phone_number || '')
const image = ref<File | null>(props.employee.photo || null)

const selectedIds = reactive<Record<TargetKey, string>>({
  company: props.employee.company_id,
  office: props.employee.office_id,
  division: props.employee.division_id,
  department: props.employee.department_id ? props.employee.department_id : '',
  group: props.employee.group_id ? props.employee.group_id : '',
})

const errorMessages = reactive<Record<string, string>>({
  name: '',
  surname: '',
  position: '',
  email: '',
  phone: '',
  company: '',
  office: '',
  division: '',
  image: '',
})

const updateValues = (values: [string, string, string, string, string]) => {
  name.value = values[0]
  surname.value = values[1]
  position.value = values[2]
  email.value = values[3]
  phone.value = values[4]
}

const updateIds = (ids: Record<TargetKey, string>) => {
  selectedIds.company = ids.company
  selectedIds.office = ids.office
  selectedIds.division = ids.division
  selectedIds.department = ids.department
  selectedIds.group = ids.group
}

const validateFields = () => {
  errorMessages.name = validateName(name.value)
  errorMessages.surname = validateSurname(surname.value)
  errorMessages.position = validatePosition(position.value)
  errorMessages.email = validateEmail(email.value)
  errorMessages.phone = validatePhone(phone.value)
  errorMessages.company = selectedIds.company ? '' : 'Pasirinkite įmonę'
  errorMessages.office = selectedIds.office ? '' : 'Pasirinkite biurą'
  errorMessages.division = selectedIds.division ? '' : 'Pasirinkite padalinį'
  if (
    errorMessages.name ||
    errorMessages.surname ||
    errorMessages.position ||
    errorMessages.email ||
    errorMessages.phone ||
    errorMessages.company ||
    errorMessages.office ||
    errorMessages.division
  ) {
    return false
  }
  return true
}

const uploadImage = (event: Event) => {
  const { image: uploadedImage, errorMessage } = handleImageUpload(event)
  image.value = uploadedImage.value
  console.log(image.value)
  errorMessages.image = errorMessage.value
}

const handleUpdateEmployee = async () => {
  if (!validateFields()) {
    return
  }
  userStore.refreshUser()
  if (!userStore.permissions?.edit_employees) {
    notificationStore.addErrorNotification('Jūs neturite teisių pakeisti kontaktą', '')
    emit('close')
    return
  }
  try {
    await updateEmployee(
      props.employee.id,
      name.value,
      surname.value,
      position.value,
      email.value,
      phone.value,
      selectedIds.company,
      selectedIds.office,
      selectedIds.division,
      selectedIds.department ? selectedIds.department : null,
      selectedIds.group ? selectedIds.group : null,
      image.value
    )

    notificationStore.addSuccessNotification('Kontaktas sėkmingai pakeistas')

    emit('update')
    emit('close')
  } catch (error) {
    notificationStore.addErrorNotification('Nepavyko pakeisti kontakto', error)
  }
}
</script>
