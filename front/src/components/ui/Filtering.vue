<template>
  <div class="filtering flex gap-4 w-full">
    <Dropdown
      :isDisabled="false"
      title="Įmonė:"
      :placeholder="PLACEHOLDERS.company"
      :selected="selectedTargets.company"
      filterBy="company"
      :items="items.company"
      class="flex-1"
      @item-selected="handleCompanySelected"
    />
    <Dropdown
      :isDisabled="!isSelected.company"
      title="Ofisas:"
      :placeholder="PLACEHOLDERS.office"
      :selected="selectedTargets.office"
      filterBy="office"
      :items="items.office"
      class="flex-1"
      @item-selected="handleOfficeSelected"
    />
    <Dropdown
      :isDisabled="!isSelected.office"
      title="Padalinys:"
      :placeholder="PLACEHOLDERS.division"
      :selected="selectedTargets.division"
      filterBy="division"
      :items="items.division"
      class="flex-1"
      @item-selected="handleDivisionSelected"
    />
    <Dropdown
      :isDisabled="!isSelected.division"
      title="Skyrius:"
      :placeholder="PLACEHOLDERS.department"
      :selected="selectedTargets.department"
      filterBy="department"
      :items="items.department"
      class="flex-1"
      @item-selected="handleDepartmentSelected"
    />
    <Dropdown
      :isDisabled="!isSelected.department"
      title="Grupė:"
      :placeholder="PLACEHOLDERS.group"
      :selected="selectedTargets.group"
      filterBy="group"
      :items="items.group"
      class="flex-1"
      @item-selected="handleGroupSelected"
    />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive } from 'vue'

import { getCompanies } from '@/services/companiesService'
import { getLowerFilteredItems } from '@/services/universalService'

import { PLACEHOLDERS, ERROR_MESSAGES, FILTER_LEVELS } from '@/constants/filteringConstants'

import { useNotificationStore } from '@/stores/Notification'

import Dropdown from '@/components/ui/Dropdown.vue'

// Define the keys used for filtering
type TargetKey = 'company' | 'office' | 'division' | 'department' | 'group'

// Reactive states for items, selection status, selected targets and filters
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

const filters = reactive({
  company: '',
  office: '',
  division: '',
  department: '',
  group: '',
})

const notificationStore = useNotificationStore()

const emit = defineEmits<{
  'filter-changed': [filters: typeof filters]
}>()

onMounted(() => {
  fetchCompanies()
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

// Universal handler function for each filter selection
const handleFilterSelection = (
  id: string,
  name: string,
  selectedRef: TargetKey,
  targetRef: TargetKey
) => {
  selectedTargets[selectedRef] = name
  isSelected[targetRef] = false
  if (targetRef !== selectedRef) {
    items[targetRef] = []
  }

  if (id !== '') {
    isSelected[selectedRef] = true
    filters[selectedRef] = id
  } else {
    filters[selectedRef] = ''
    isSelected[selectedRef] = false
  }

  return true
}

// Specific handlers for each filter level
const handleCompanySelected = (id: string, name: string) => {
  const success = handleFilterSelection(id, name, 'company', 'office')
  if (success && id !== '') {
    fetchOffices(id)
  }

  handleOfficeSelected('', PLACEHOLDERS.office)
}

const handleOfficeSelected = (id: string, name: string) => {
  const success = handleFilterSelection(id, name, 'office', 'division')
  if (success && id !== '') {
    fetchDivisions(id)
  }

  handleDivisionSelected('', PLACEHOLDERS.division)
}

const handleDivisionSelected = (id: string, name: string) => {
  const success = handleFilterSelection(id, name, 'division', 'department')
  if (success && id !== '') {
    fetchDepartments(id)
  }

  handleDepartmentSelected('', PLACEHOLDERS.department)
}

const handleDepartmentSelected = (id: string, name: string) => {
  const success = handleFilterSelection(id, name, 'department', 'group')
  if (success && id !== '') {
    fetchGroups(id)
  }

  handleGroupSelected('', PLACEHOLDERS.group)
}

const handleGroupSelected = (id: string, name: string) => {
  handleFilterSelection(id, name, 'group', 'group')

  emit('filter-changed', { ...filters })
}
</script>
