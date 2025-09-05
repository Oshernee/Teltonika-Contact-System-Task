<template>
  <div class="filtering flex gap-4 w-full">
    <Dropdown
      :isDisabled="false"
      title="Įmonė:"
      :placeholder="companyPlaceholder"
      filterBy="company"
      :items="companies"
      class="flex-1"
      @item-selected="handleCompanySelected"
    />
    <Dropdown
      :isDisabled="!isCompanySelected"
      title="Ofisas:"
      :placeholder="officePlaceholder"
      filterBy="office"
      :items="offices"
      class="flex-1"
      @item-selected="handleOfficeSelected"
    />
    <Dropdown
      :isDisabled="!isOfficeSelected"
      title="Padalinys:"
      :placeholder="divisionPlaceholder"
      filterBy="division"
      :items="divisions"
      class="flex-1"
      @item-selected="handleDivisionSelected"
    />
    <Dropdown
      :isDisabled="!isDivisionSelected"
      title="Skyrius:"
      :placeholder="departmentPlaceholder"
      filterBy="department"
      :items="departments"
      class="flex-1"
      @item-selected="handleDepartmentSelected"
    />
    <Dropdown
      :isDisabled="!isDepartmentSelected"
      title="Grupė:"
      :placeholder="groupPlaceholder"
      filterBy="group"
      :items="groups"
      class="flex-1"
      @item-selected="handleGroupSelected"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import type { Employee } from '../types/employees'
import Dropdown from './Dropdown.vue'

const isCompanySelected = ref(false)
const isOfficeSelected = ref(false)
const isDivisionSelected = ref(false)
const isDepartmentSelected = ref(false)

const companyPlaceholder = ref('Pasirinkite įmonę')
const officePlaceholder = ref('Pasirinkite ofisą')
const divisionPlaceholder = ref('Pasirinkite padalinį')
const departmentPlaceholder = ref('Pasirinkite skyrių')
const groupPlaceholder = ref('Pasirinkite grupę')

const props = defineProps<{
  employees: Employee[]
}>()

const emit = defineEmits<{
  'filter-changed': [filterType: string, value: string | number]
}>()

const companies = computed(() => {
  const uniqueCompanies = new Set<string>()
  props.employees.forEach((employee) => {
    if (employee.expand?.company_id?.name) {
      uniqueCompanies.add(employee.expand.company_id.name)
    }
  })
  return Array.from(uniqueCompanies)
})

const offices = computed(() => {
  const uniqueOffices = new Set<string>()
  props.employees.forEach((employee) => {
    if (employee.expand?.office_id?.name) {
      uniqueOffices.add(employee.expand.office_id.name)
    }
  })
  return Array.from(uniqueOffices)
})

const divisions = computed(() => {
  const uniqueDivisions = new Set<string>()
  props.employees.forEach((employee) => {
    if (employee.expand?.division_id?.name) {
      uniqueDivisions.add(employee.expand.division_id.name)
    }
  })
  return Array.from(uniqueDivisions)
})

const departments = computed(() => {
  const uniqueDepartments = new Set<string>()
  props.employees.forEach((employee) => {
    if (employee.expand?.department_id?.name) {
      uniqueDepartments.add(employee.expand.department_id.name)
    }
  })
  return Array.from(uniqueDepartments)
})

const groups = computed(() => {
  const uniqueGroups = new Set<string>()
  props.employees.forEach((employee) => {
    if (employee.expand?.group_id?.name) {
      uniqueGroups.add(employee.expand.group_id.name)
    }
  })
  return Array.from(uniqueGroups)
})

function handleCompanySelected(value: string | number) {
  isCompanySelected.value = true
  isOfficeSelected.value = false
  isDivisionSelected.value = false
  isDepartmentSelected.value = false
  officePlaceholder.value = 'Pasirinkite ofisą'
  divisionPlaceholder.value = 'Pasirinkite padalinį'
  departmentPlaceholder.value = 'Pasirinkite skyrių'
  groupPlaceholder.value = 'Pasirinkite grupę'
  emit('filter-changed', 'company', value)
}

function handleOfficeSelected(value: string | number) {
  isOfficeSelected.value = true
  isDivisionSelected.value = false
  isDepartmentSelected.value = false
  divisionPlaceholder.value = 'Pasirinkite padalinį'
  departmentPlaceholder.value = 'Pasirinkite skyrių'
  groupPlaceholder.value = 'Pasirinkite grupę'
  emit('filter-changed', 'office', value)
}

function handleDivisionSelected(value: string | number) {
  isDivisionSelected.value = true
  isDepartmentSelected.value = false
  divisionPlaceholder.value = 'Pasirinkite padalinį'
  departmentPlaceholder.value = 'Pasirinkite skyrių'
  groupPlaceholder.value = 'Pasirinkite grupę'
  emit('filter-changed', 'division', value)
}

function handleDepartmentSelected(value: string | number) {
  isDepartmentSelected.value = true
  departmentPlaceholder.value = 'Pasirinkite skyrių'
  groupPlaceholder.value = 'Pasirinkite grupę'
  emit('filter-changed', 'department', value)
}

function handleGroupSelected(value: string | number) {
  emit('filter-changed', 'group', value)
}
</script>
