<template>
  <Dropdown
    :isDisabled="false"
    title="Įmonė"
    :placeholder="PLACEHOLDERS.company"
    :selected="selectedTargets.company"
    filterBy="company"
    :items="items.company"
    class="flex-1 z-50 pt-2 pb-1"
    @item-selected="handleCompanySelected"
    :isNecessary="props.isErrorNecessary"
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
    :isNecessary="props.isErrorNecessary"
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
    :isNecessary="props.isErrorNecessary"
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
</template>

<script lang="ts" setup>
import { onMounted, reactive } from 'vue'

import Dropdown from '@/components/ui/Dropdown.vue'

import { getCompanies } from '@/services/companiesService'
import { getLowerFilteredItems } from '@/services/universalService'

import { PLACEHOLDERS, ERROR_MESSAGES, FILTER_LEVELS } from '@/constants/filteringConstants'

import { useNotificationStore } from '@/stores/Notification'

type TargetKey = 'company' | 'office' | 'division' | 'department' | 'group'
const notificationStore = useNotificationStore()

const emit = defineEmits(['update', 'close', 'updateCurrent', 'delete'])

const props = defineProps<{
  modelValue: {
    company: string
    office: string
    division: string
    department: string
    group: string
  }
  isErrorNecessary?: boolean
  errorMessages: Record<string, string>
}>()

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
  image: '',
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

  emit('update', { ...selectedIds })
}
</script>
