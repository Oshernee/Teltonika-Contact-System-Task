<template>
  <div class="w-[1200px] h-[750px]">
    <div class="p-6 space-x-6 flex flex-row">
      <div class="w-1/2 pr-6">
        <h1 class="text-3xl pl-6">Pridėti kontaktą:</h1>
        <div class="mt-4">
          <label class="block mt-4 text-lg font-medium text-gray-500"
            >Vardas<span class="text-red-600 ml-1">*</span></label
          >
          <input
            v-model="name"
            type="text"
            placeholder="Įveskite vardą..."
            class="mt-1 block w-full px-4 py-3 bg-gray-200 rounded-md placeholder-gray-800 font-extralight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          />
        </div>
        <div class="text-red-500 text-sm mt-1 absolute w-[400px]" v-if="errorMessages.name">
          {{ errorMessages.name }}
        </div>
        <div class="mt-6">
          <label class="block mt-4 text-lg font-medium text-gray-500"
            >Pavardė<span class="text-red-600 ml-1">*</span></label
          >
          <input
            v-model="surname"
            type="text"
            placeholder="Įveskite pavardę..."
            class="mt-1 block w-full px-4 py-3 bg-gray-200 rounded-md placeholder-gray-800 font-extralight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          />
        </div>
        <div class="text-red-500 text-sm mt-1 absolute w-[400px]" v-if="errorMessages.surname">
          {{ errorMessages.surname }}
        </div>
        <div class="mt-6">
          <label class="block mt-4 text-lg font-medium text-gray-500"
            >Pozicija<span class="text-red-600 ml-1">*</span></label
          >
          <input
            v-model="position"
            type="text"
            placeholder="Įveskite poziciją..."
            class="mt-1 block w-full px-4 py-3 bg-gray-200 rounded-md placeholder-gray-800 font-extralight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          />
        </div>
        <div class="text-red-500 text-sm mt-1 absolute w-[400px]" v-if="errorMessages.position">
          {{ errorMessages.position }}
        </div>
        <h1 class="text-2xl pl-6 pt-8">Kontaktinė informacija:</h1>
        <div class="mt-6">
          <label class="block mt-4 text-lg font-medium text-gray-500"
            >El. paštas<span class="text-red-600 ml-1">*</span></label
          >
          <div class="relative">
            <div class="absolute inset-y-0 start-0 flex items-center ps-2 pointer-events-none">
              <img :src="Email" class="w-6 h-6 text-gray-400" alt="Email" />
            </div>
            <input
              v-model="email"
              type="email"
              placeholder="Įveskite el. paštą..."
              class="mt-1 mr-4 block w-full px-4 py-3 bg-gray-200 rounded-md placeholder-gray-800 font-extralight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent ps-10 p-2.5"
            />
          </div>
        </div>
        <div class="text-red-500 text-sm mt-1 absolute w-[400px]" v-if="errorMessages.email">
          {{ errorMessages.email }}
        </div>
        <div class="mt-6">
          <label class="block mt-4 text-lg font-medium text-gray-500">Telefono numeris</label>
          <div class="relative">
            <div class="absolute inset-y-0 start-0 flex items-center ps-2 pointer-events-none">
              <img :src="Phone" class="w-6 h-6 text-gray-400" alt="Phone" />
            </div>
            <input
              v-model="phone"
              type="tel"
              placeholder="Įveskite telefono numerį..."
              class="mt-1 block w-full px-4 py-3 bg-gray-200 rounded-md placeholder-gray-800 font-extralight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent ps-10 p-2.5"
            />
          </div>
        </div>
        <div class="text-red-500 text-sm mt-1 absolute w-[400px]" v-if="errorMessages.phone">
          {{ errorMessages.phone }}
        </div>
      </div>

      <div class="w-1/2 pl-6">
        <h1 class="text-xl pl-6 mb-6">Įmonės detalės:</h1>

        <div>
          <Dropdown
            :isDisabled="false"
            title="Įmonė"
            :placeholder="PLACEHOLDERS.company"
            :selected="selectedTargets.company"
            filterBy="company"
            :items="items.company"
            class="flex-1 z-50 pt-2 pb-1"
            @item-selected="handleCompanySelected"
            :isNecessary="true"
          />
          <div class="text-red-500 text-sm absolute w-[400px]" v-if="errorMessages.company">
            {{ errorMessages.company }}
          </div>
          <Dropdown
            :isDisabled="!isSelected.company"
            title="Ofisas"
            :placeholder="PLACEHOLDERS.office"
            :selected="selectedTargets.office"
            filterBy="office"
            :items="items.office"
            class="flex-1 z-40 pt-6 pb-1"
            @item-selected="handleOfficeSelected"
            :isNecessary="true"
          />
          <div class="text-red-500 text-sm absolute w-[400px]" v-if="errorMessages.office">
            {{ errorMessages.office }}
          </div>
          <Dropdown
            :isDisabled="!isSelected.office"
            title="Padalinys"
            :placeholder="PLACEHOLDERS.division"
            :selected="selectedTargets.division"
            filterBy="division"
            :items="items.division"
            class="flex-1 z-30 pt-6 pb-1"
            @item-selected="handleDivisionSelected"
            :isNecessary="true"
          />
          <div class="text-red-500 text-sm absolute w-[400px]" v-if="errorMessages.division">
            {{ errorMessages.division }}
          </div>
          <Dropdown
            :isDisabled="!isSelected.division"
            title="Skyrius"
            :placeholder="PLACEHOLDERS.department"
            :selected="selectedTargets.department"
            filterBy="department"
            :items="items.department"
            class="flex-1 z-20 pt-6 pb-1"
            @item-selected="handleDepartmentSelected"
          />
          <Dropdown
            :isDisabled="!isSelected.department"
            title="Grupė"
            :placeholder="PLACEHOLDERS.group"
            :selected="selectedTargets.group"
            filterBy="group"
            :items="items.group"
            class="flex-1 z-10 pt-6 pb-1"
            @item-selected="handleGroupSelected"
          />

          <div class="pt-20">
            <button
              class="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 transition-colors mb-2"
            >
              KELTI NUOTRAUKĄ
            </button>
            <p class="text-sm text-gray-500 text-center">No photo uploaded.</p>
          </div>
        </div>
      </div>
    </div>

    <div class="flex justify-end px-6 pb-6">
      <button
        @click="handleAddEmployee"
        class="w-72 bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 transition-colors"
      >
        PRIDĖTI
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'

import Email from '@/assets/Email.svg'
import Phone from '@/assets/PhoneNumber.svg'

import {
  validateEmail,
  validatePhone,
  validateName,
  validateSurname,
  validatePosition,
} from '@/utils/validateInputs'

import Dropdown from '@/components/ui/Dropdown.vue'

import { getCompanies } from '@/services/companiesService'
import { getLowerFilteredItems } from '@/services/universalService'
import { createEmployee } from '@/services/employeeService'

import { PLACEHOLDERS, ERROR_MESSAGES, FILTER_LEVELS } from '@/constants/filteringConstants'

import { useNotificationStore } from '@/stores/Notification'
import { useUserStore } from '@/stores/Auth'

type TargetKey = 'company' | 'office' | 'division' | 'department' | 'group'
const notificationStore = useNotificationStore()
const userStore = useUserStore()

const emit = defineEmits(['update', 'close', 'updateCurrent', 'delete'])

onMounted(() => {
  fetchCompanies()
})

const name = ref('')
const surname = ref('')
const position = ref('')
const email = ref('')
const phone = ref('')

const items = reactive<Record<TargetKey, { id: string; name: string }[]>>({
  company: [],
  office: [],
  division: [],
  department: [],
  group: [],
})

const isSelected = reactive<Record<TargetKey, boolean>>({
  company: false,
  office: false,
  division: false,
  department: false,
  group: false,
})

const selectedTargets = reactive<Record<TargetKey, string>>({
  company: PLACEHOLDERS.company,
  office: PLACEHOLDERS.office,
  division: PLACEHOLDERS.division,
  department: PLACEHOLDERS.department,
  group: PLACEHOLDERS.group,
})

const selectedIds = reactive<Record<TargetKey, string>>({
  company: '',
  office: '',
  division: '',
  department: '',
  group: '',
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
})

// Fetch functions for each filter level
const fetchCompanies = async () => {
  try {
    const companiesData = await getCompanies()
    items.company = companiesData
  } catch (error) {
    notificationStore.addErrorNotification(ERROR_MESSAGES.company, error)
  }
}

const fetchLowers = async (level: string, id: string, target: TargetKey) => {
  try {
    const data = await getLowerFilteredItems(FILTER_LEVELS[level], id)
    items[target] = data
  } catch (error) {
    notificationStore.addErrorNotification(`Nepavyko užkrauti ${level}`, error)
    return []
  }
}

const handleSelection = (id: string, name: string, target: TargetKey): boolean => {
  if (id === '') {
    isSelected[target] = false
    selectedTargets[target] = PLACEHOLDERS[target]
    return false
  } else {
    isSelected[target] = true
    selectedTargets[target] = name
    return true
  }
}

// Specific handlers for each level
const handleCompanySelected = (id: string, name: string) => {
  const success = handleSelection(id, name, 'company')
  if (success && id !== '') {
    selectedIds.company = id
    fetchLowers('offices', id, 'office')
  }

  handleOfficeSelected('', PLACEHOLDERS.office)
}

const handleOfficeSelected = (id: string, name: string) => {
  const success = handleSelection(id, name, 'office')
  if (success && id !== '') {
    selectedIds.office = id
    fetchLowers('divisions', id, 'division')
  }

  handleDivisionSelected('', PLACEHOLDERS.division)
}

const handleDivisionSelected = (id: string, name: string) => {
  const success = handleSelection(id, name, 'division')
  if (success && id !== '') {
    selectedIds.division = id
    fetchLowers('departments', id, 'department')
  }

  handleDepartmentSelected('', PLACEHOLDERS.department)
}

const handleDepartmentSelected = (id: string, name: string) => {
  const success = handleSelection(id, name, 'department')
  if (success && id !== '') {
    selectedIds.department = id
    fetchLowers('groups', id, 'group')
  }

  handleGroupSelected('', PLACEHOLDERS.group)
}

const handleGroupSelected = (id: string, name: string) => {
  handleSelection(id, name, 'group')
  if (id !== '') {
    selectedIds.group = id
  } else {
    selectedIds.group = ''
  }
}

const validateFields = () => {
  errorMessages.name = validateName(name.value)
  errorMessages.surname = validateSurname(surname.value)
  errorMessages.position = validatePosition(position.value)
  errorMessages.email = validateEmail(email.value)
  errorMessages.phone = validatePhone(phone.value)
  errorMessages.company = isSelected.company ? '' : 'Pasirinkite įmonę'
  errorMessages.office = isSelected.office ? '' : 'Pasirinkite biurą'
  errorMessages.division = isSelected.division ? '' : 'Pasirinkite padalinį'
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

const handleAddEmployee = async () => {
  if (!validateFields()) {
    return
  }
  userStore.refreshUser()
  if (!userStore.permissions?.edit_employees) {
    notificationStore.addErrorNotification('Jūs neturite teisių pridėti kontaktą', '')
    emit('close')
    return
  }
  try {
    await createEmployee(
      name.value,
      surname.value,
      position.value,
      email.value,
      phone.value,
      selectedIds.company,
      selectedIds.office,
      selectedIds.division,
      isSelected.department ? selectedIds.department : null,
      isSelected.group ? selectedIds.group : null
    )

    notificationStore.addSuccessNotification('Kontaktas sėkmingai pridėtas')

    emit('update')
    emit('close')
  } catch (error) {
    notificationStore.addErrorNotification('Nepavyko pridėti kontakto', error)
  }
}
</script>
