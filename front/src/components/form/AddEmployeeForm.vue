<template>
  <div class="w-[1200px] h-[750px]">
    <div class="p-6 space-x-6 flex flex-row">
      <div class="w-1/2 pr-6">
        <h1 class="text-3xl pl-6">Pridėti kontaktą:</h1>
        <div class="mt-2 mb-2">
          <label class="block mt-4 text-lg font-medium text-gray-500">Vardas:</label>
          <input
            type="text"
            placeholder="Įveskite vardą..."
            class="mt-1 block w-full px-4 py-3 bg-gray-200 rounded-md placeholder-gray-800 font-extralight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          />
        </div>
        <div class="mt-2 mb-2">
          <label class="block mt-4 text-lg font-medium text-gray-500">Pavardė:</label>
          <input
            type="text"
            placeholder="Įveskite pavardę..."
            class="mt-1 block w-full px-4 py-3 bg-gray-200 rounded-md placeholder-gray-800 font-extralight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          />
        </div>
        <div class="mt-2 mb-2">
          <label class="block mt-4 text-lg font-medium text-gray-500">Pozicija:</label>
          <input
            type="text"
            placeholder="Įveskite poziciją..."
            class="mt-1 block w-full px-4 py-3 bg-gray-200 rounded-md placeholder-gray-800 font-extralight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          />
        </div>
        <h1 class="text-2xl pl-6 pt-8">Kontaktinė informacija:</h1>
        <div class="mt-2 mb-2">
          <label class="block mt-4 text-lg font-medium text-gray-500">El. paštas:</label>
          <div class="relative">
            <div class="absolute inset-y-0 start-0 flex items-center ps-2 pointer-events-none">
              <img :src="Email" class="w-6 h-6 text-gray-400" alt="Email" />
            </div>
            <input
              type="email"
              placeholder="Įveskite el. paštą..."
              class="mt-1 mr-4 block w-full px-4 py-3 bg-gray-200 rounded-md placeholder-gray-800 font-extralight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent ps-10 p-2.5"
            />
          </div>
        </div>
        <div class="mt-2 mb-2">
          <label class="block mt-4 text-lg font-medium text-gray-500">Telefono numeris:</label>
          <div class="relative">
            <div class="absolute inset-y-0 start-0 flex items-center ps-2 pointer-events-none">
              <img :src="Phone" class="w-6 h-6 text-gray-400" alt="Phone" />
            </div>
            <input
              type="tel"
              placeholder="Įveskite telefono numerį..."
              class="mt-1 block w-full px-4 py-3 bg-gray-200 rounded-md placeholder-gray-800 font-extralight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent ps-10 p-2.5"
            />
          </div>
        </div>
      </div>

      <div class="w-1/2 pl-6">
        <h1 class="text-xl pl-6 mb-6">Įmonės detalės:</h1>

        <div class="space-y-4">
          <Dropdown
            :isDisabled="false"
            title="Įmonė:"
            :placeholder="PLACEHOLDERS.company"
            :selected="selectedTargets.company"
            filterBy="company"
            :items="items.company"
            class="flex-1 z-50"
            @item-selected="handleCompanySelected"
          />
          <Dropdown
            :isDisabled="!isSelected.company"
            title="Ofisas:"
            :placeholder="PLACEHOLDERS.office"
            :selected="selectedTargets.office"
            filterBy="office"
            :items="items.office"
            class="flex-1 z-49"
            @item-selected="handleOfficeSelected"
          />
          <Dropdown
            :isDisabled="!isSelected.office"
            title="Padalinys:"
            :placeholder="PLACEHOLDERS.division"
            :selected="selectedTargets.division"
            filterBy="division"
            :items="items.division"
            class="flex-1 z-48"
            @item-selected="handleDivisionSelected"
          />
          <Dropdown
            :isDisabled="!isSelected.division"
            title="Skyrius:"
            :placeholder="PLACEHOLDERS.department"
            :selected="selectedTargets.department"
            filterBy="department"
            :items="items.department"
            class="flex-1 z-47"
            @item-selected="handleDepartmentSelected"
          />
          <Dropdown
            :isDisabled="!isSelected.department"
            title="Grupė:"
            :placeholder="PLACEHOLDERS.group"
            :selected="selectedTargets.group"
            filterBy="group"
            :items="items.group"
            class="flex-1 z-46"
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
        class="w-72 bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 transition-colors"
      >
        PRIDĖTI
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive } from 'vue'

import Email from '@/assets/Email.svg'
import Phone from '@/assets/PhoneNumber.svg'

import Dropdown from '@/components/ui/Dropdown.vue'

import { getCompanies } from '@/services/companiesService'
import { getLowerFilteredItems } from '@/services/universalService'

import { PLACEHOLDERS, ERROR_MESSAGES, FILTER_LEVELS } from '@/constants/filteringConstants'

import { useNotificationStore } from '@/stores/Notification'

type TargetKey = 'company' | 'office' | 'division' | 'department' | 'group'
const notificationStore = useNotificationStore()

const emit = defineEmits(['update', 'close', 'updateCurrent', 'delete'])

onMounted(() => {
  fetchCompanies()
})

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

// Fetch functions for each filter level
const fetchCompanies = async () => {
  try {
    const companiesData = await getCompanies()
    items.company = companiesData
  } catch (error) {
    notificationStore.addErrorNotification(ERROR_MESSAGES.company, error)
  }
}

const fetchOffices = async (companyId: string) => {
  try {
    const officesData = await getLowerFilteredItems(FILTER_LEVELS.offices, companyId)
    items.office = officesData
  } catch (error) {
    notificationStore.addErrorNotification(ERROR_MESSAGES.office, error)
  }
}

const fetchDivisions = async (officeId: string) => {
  try {
    const divisionsData = await getLowerFilteredItems(FILTER_LEVELS.divisions, officeId)
    items.division = divisionsData
  } catch (error) {
    notificationStore.addErrorNotification(ERROR_MESSAGES.division, error)
  }
}

const fetchDepartments = async (divisionId: string) => {
  try {
    const departmentsData = await getLowerFilteredItems(FILTER_LEVELS.departments, divisionId)
    items.department = departmentsData
  } catch (error) {
    notificationStore.addErrorNotification(ERROR_MESSAGES.department, error)
  }
}

const fetchGroups = async (departmentId: string) => {
  try {
    const groupsData = await getLowerFilteredItems(FILTER_LEVELS.groups, departmentId)
    items.group = groupsData
  } catch (error) {
    notificationStore.addErrorNotification(ERROR_MESSAGES.group, error)
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

// Specific handlers for each filter level
const handleCompanySelected = (id: string, name: string) => {
  console.log('Selected company ID:', id)
  console.log('Selected company Name:', name)
  const success = handleSelection(id, name, 'company')
  console.log('Handle selection success:', success)
  if (success && id !== '') {
    fetchOffices(id)
  }

  handleOfficeSelected('', PLACEHOLDERS.office)
}

const handleOfficeSelected = (id: string, name: string) => {
  const success = handleSelection(id, name, 'office')
  if (success && id !== '') {
    fetchDivisions(id)
  }

  handleDivisionSelected('', PLACEHOLDERS.division)
}

const handleDivisionSelected = (id: string, name: string) => {
  const success = handleSelection(id, name, 'division')
  if (success && id !== '') {
    fetchDepartments(id)
  }

  handleDepartmentSelected('', PLACEHOLDERS.department)
}

const handleDepartmentSelected = (id: string, name: string) => {
  const success = handleSelection(id, name, 'department')
  if (success && id !== '') {
    fetchGroups(id)
  }

  handleGroupSelected('', PLACEHOLDERS.group)
}

const handleGroupSelected = (id: string, name: string) => {
  handleSelection(id, name, 'group')
}
</script>
