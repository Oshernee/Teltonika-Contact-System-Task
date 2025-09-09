<template>
  <div class="filtering flex gap-4 w-full">
    <Dropdown
      :isDisabled="false"
      title="Įmonė:"
      :placeholder="companyPlaceholder"
      filterBy="company"
      :items="isCompanySelected ? prevCompanies : companies ?? []"
      class="flex-1"
      @item-selected="handleCompanySelected"
    />
    <Dropdown
      :isDisabled="!isCompanySelected"
      title="Ofisas:"
      :placeholder="officePlaceholder"
      filterBy="office"
      :items="isOfficeSelected ? prevOffices : offices ?? []"
      class="flex-1"
      @item-selected="handleOfficeSelected"
    />
    <Dropdown
      :isDisabled="!isOfficeSelected"
      title="Padalinys:"
      :placeholder="divisionPlaceholder"
      filterBy="division"
      :items="isDivisionSelected ? prevDivisions : divisions ?? []"
      class="flex-1"
      @item-selected="handleDivisionSelected"
    />
    <Dropdown
      :isDisabled="!isDivisionSelected"
      title="Skyrius:"
      :placeholder="departmentPlaceholder"
      filterBy="department"
      :items="isDepartmentSelected ? prevDepartments : departments ?? []"
      class="flex-1"
      @item-selected="handleDepartmentSelected"
    />
    <Dropdown
      :isDisabled="!isDepartmentSelected"
      title="Grupė:"
      :placeholder="groupPlaceholder"
      filterBy="group"
      :items="isGroupSelected ? prevGroups : groups ?? []"
      class="flex-1"
      @item-selected="handleGroupSelected"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import type { Employee } from '../types/employees'
import Dropdown from './Dropdown.vue'
import { GetIDByName, getNamesByCollection } from '../services/universalService'

const isCompanySelected = ref(false)
const isOfficeSelected = ref(false)
const isDivisionSelected = ref(false)
const isDepartmentSelected = ref(false)
const isGroupSelected = ref(false)

const companyPlaceholder = ref('Pasirinkite įmonę')
const officePlaceholder = ref('Pasirinkite ofisą')
const divisionPlaceholder = ref('Pasirinkite padalinį')
const departmentPlaceholder = ref('Pasirinkite skyrių')
const groupPlaceholder = ref('Pasirinkite grupę')

const prevCompanies = ref<string[]>([])
const prevOffices = ref<string[]>([])
const prevDivisions = ref<string[]>([])
const prevDepartments = ref<string[]>([])
const prevGroups = ref<string[]>([])

const allCompanies = await getNamesByCollection('companies')
const allOffices = await getNamesByCollection('offices')
const allDivisions = await getNamesByCollection('divisions')
const allDepartments = await getNamesByCollection('departments')
const allGroups = await getNamesByCollection('groups')

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

const handleCompanySelected = async (value: string | number) => {
  if (!isCompanySelected.value) {
    prevCompanies.value = companies.value
  }

  isCompanySelected.value = true
  isOfficeSelected.value = false
  isDivisionSelected.value = false
  isDepartmentSelected.value = false
  officePlaceholder.value = 'Pasirinkite ofisą'
  divisionPlaceholder.value = 'Pasirinkite padalinį'
  departmentPlaceholder.value = 'Pasirinkite skyrių'
  groupPlaceholder.value = 'Pasirinkite grupę'

  const companyId = await GetIDByName('companies', value as string)

  emit('filter-changed', 'company', companyId)
}

const handleOfficeSelected = async (value: string | number) => {
  if (!isOfficeSelected.value) {
    prevOffices.value = offices.value
  }

  isOfficeSelected.value = true
  isDivisionSelected.value = false
  isDepartmentSelected.value = false
  divisionPlaceholder.value = 'Pasirinkite padalinį'
  departmentPlaceholder.value = 'Pasirinkite skyrių'
  groupPlaceholder.value = 'Pasirinkite grupę'

  const officeId = await GetIDByName('offices', value as string)

  emit('filter-changed', 'office', officeId)
}

const handleDivisionSelected = async (value: string | number) => {
  if (!isDivisionSelected.value) {
    prevDivisions.value = divisions.value
  }

  isDivisionSelected.value = true
  isDepartmentSelected.value = false
  divisionPlaceholder.value = 'Pasirinkite padalinį'
  departmentPlaceholder.value = 'Pasirinkite skyrių'
  groupPlaceholder.value = 'Pasirinkite grupę'

  const divisionId = await GetIDByName('divisions', value as string)

  emit('filter-changed', 'division', divisionId)
}

const handleDepartmentSelected = async (value: string | number) => {
  if (!isDepartmentSelected.value) {
    prevDepartments.value = departments.value
  }

  isDepartmentSelected.value = true
  departmentPlaceholder.value = 'Pasirinkite skyrių'
  groupPlaceholder.value = 'Pasirinkite grupę'

  const departmentId = await GetIDByName('departments', value as string)

  emit('filter-changed', 'department', departmentId)
}

const handleGroupSelected = async (value: string | number) => {
  if (!isDepartmentSelected.value) {
    prevGroups.value = groups.value
  }

  isGroupSelected.value = true

  const groupId = await GetIDByName('groups', value as string)

  emit('filter-changed', 'group', groupId)
}
</script>
