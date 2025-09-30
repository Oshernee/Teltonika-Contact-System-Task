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

let name = props.employee.name
let surname = props.employee.surname
let position = props.employee.position
let email = props.employee.email
let phone = props.employee.phone_number || ''
const valuesChanged = ref(false)
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
  name = trimWhiteSpace(values[0])
  surname = trimWhiteSpace(values[1])
  position = trimWhiteSpace(values[2])
  email = trimWhiteSpace(values[3])
  phone = trimWhiteSpace(values[4])
  valuesChanged.value = true
}

const updateIds = (ids: Record<TargetKey, string>) => {
  selectedIds.company = ids.company
  selectedIds.office = ids.office
  selectedIds.division = ids.division
  selectedIds.department = ids.department
  selectedIds.group = ids.group
  valuesChanged.value = true
}

function trimWhiteSpace(str: string): string {
  return str.trim().replace(/\s+/g, ' ')
}

const validateFields = () => {
  errorMessages.name = validateName(name)
  errorMessages.surname = validateSurname(surname)
  errorMessages.position = validatePosition(position)
  errorMessages.email = validateEmail(email)
  errorMessages.phone = validatePhone(phone)
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
  errorMessages.image = errorMessage.value
}

const handleUpdateEmployee = async () => {
  if (!validateFields()) {
    return
  }
  if (!valuesChanged.value) {
    notificationStore.addInfoNotification('Nėra padarytų pakeitimų')
    return
  }
  try {
    await userStore.refreshUser()
    if (!userStore.permissions?.edit_employees) {
      notificationStore.addErrorNotification('Jūs neturite teisių pakeisti kontaktą', '')
      emit('close')
      return
    }
    await updateEmployee(
      props.employee.id,
      name,
      surname,
      position,
      email,
      phone,
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
