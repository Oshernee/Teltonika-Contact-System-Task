<template>
  <div class="filtering flex gap-4 w-full">
    <Dropdown
      :isDisabled="false"
      title="Įmonė:"
      :placeholder="companyPlaceholder"
      :selected="selectedCompany"
      filterBy="company"
      :items="companies"
      class="flex-1"
      @item-selected="handleCompanySelected"
    />
    <Dropdown
      :isDisabled="!isCompanySelected"
      title="Ofisas:"
      :placeholder="officePlaceholder"
      :selected="selectedOffice"
      filterBy="office"
      :items="offices"
      class="flex-1"
      @item-selected="handleOfficeSelected"
    />
    <Dropdown
      :isDisabled="!isOfficeSelected"
      title="Padalinys:"
      :placeholder="divisionPlaceholder"
      :selected="selectedDivision"
      filterBy="division"
      :items="divisions"
      class="flex-1"
      @item-selected="handleDivisionSelected"
    />
    <Dropdown
      :isDisabled="!isDivisionSelected"
      title="Skyrius:"
      :placeholder="departmentPlaceholder"
      :selected="selectedDepartment"
      filterBy="department"
      :items="departments"
      class="flex-1"
      @item-selected="handleDepartmentSelected"
    />
    <Dropdown
      :isDisabled="!isDepartmentSelected"
      title="Grupė:"
      :placeholder="groupPlaceholder"
      :selected="selectedGroup"
      filterBy="group"
      :items="groups"
      class="flex-1"
      @item-selected="handleGroupSelected"
    />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, reactive } from 'vue'

import { getCompanies } from '../services/companiesService'
import { getLowerFilteredItems } from '../services/universalService'

import Dropdown from './Dropdown.vue'

const isCompanySelected = ref(false)
const isOfficeSelected = ref(false)
const isDivisionSelected = ref(false)
const isDepartmentSelected = ref(false)
const isGroupSelected = ref(false)

const companyPlaceholder = 'Pasirinkite įmonę'
const officePlaceholder = 'Pasirinkite ofisą'
const divisionPlaceholder = 'Pasirinkite padalinį'
const departmentPlaceholder = 'Pasirinkite skyrių'
const groupPlaceholder = 'Pasirinkite grupę'

const selectedCompany = ref<string>(companyPlaceholder)
const selectedOffice = ref<string>(officePlaceholder)
const selectedDivision = ref<string>(divisionPlaceholder)
const selectedDepartment = ref<string>(departmentPlaceholder)
const selectedGroup = ref<string>(groupPlaceholder)

const companies = ref<{ id: string; name: string }[]>([])
const offices = ref<{ id: string; name: string }[]>([])
const divisions = ref<{ id: string; name: string }[]>([])
const departments = ref<{ id: string; name: string }[]>([])
const groups = ref<{ id: string; name: string }[]>([])

const filters = reactive({
  company: '',
  office: '',
  division: '',
  department: '',
  group: '',
})

const emit = defineEmits<{
  'filter-changed': [filters: typeof filters]
}>()

onMounted(() => {
  fetchCompanies()
})

const fetchCompanies = async () => {
  try {
    const companiesData = await getCompanies()
    companies.value = companiesData
      .map((company) => ({ id: company.id, name: company.name }))
      .filter((item): item is { id: string; name: string } => item !== undefined)
  } catch (error) {
    console.error('Klaida gaunant įmones:', error)
  }
}

const fetchOffices = async (companyId: string) => {
  try {
    const officesData = await getLowerFilteredItems(
      'companies_offices',
      'offices',
      'company_id',
      'office_id',
      companyId
    )
    offices.value = officesData
      .map((office) => ({ id: office.id, name: office.name }))
      .filter((item): item is { id: string; name: string } => item !== undefined)
  } catch (error) {
    console.error('Klaida gaunant ofisus:', error)
  }
}

const fetchDivisions = async (officeId: string) => {
  try {
    const divisionsData = await getLowerFilteredItems(
      'offices_divisions',
      'divisions',
      'office_id',
      'division_id',
      officeId
    )
    divisions.value = divisionsData
      .map((division) => ({ id: division.id, name: division.name }))
      .filter((item): item is { id: string; name: string } => item !== undefined)
  } catch (error) {
    console.error('Klaida gaunant padalinius:', error)
  }
}

const fetchDepartments = async (divisionId: string) => {
  try {
    const departmentsData = await getLowerFilteredItems(
      'divisions_departments',
      'departments',
      'division_id',
      'department_id',
      divisionId
    )
    departments.value = departmentsData
      .map((department) => ({ id: department.id, name: department.name }))
      .filter((item): item is { id: string; name: string } => item !== undefined)
  } catch (error) {
    console.error('Klaida gaunant skyrius:', error)
  }
}

const fetchGroups = async (departmentId: string) => {
  try {
    const groupsData = await getLowerFilteredItems(
      'departments_groups',
      'groups',
      'department_id',
      'group_id',
      departmentId
    )
    groups.value = groupsData
      .map((group) => ({ id: group.id, name: group.name }))
      .filter((item): item is { id: string; name: string } => item !== undefined)
  } catch (error) {
    console.error('Klaida gaunant grupes:', error)
  }
}

const handleCompanySelected = (id: string, name: string) => {
  selectedCompany.value = name
  isOfficeSelected.value = false
  offices.value = []

  if (id !== '') {
    isCompanySelected.value = true
    fetchOffices(id)
    filters.company = id
  } else {
    filters.company = ''
    isCompanySelected.value = false
  }

  handleOfficeSelected('', officePlaceholder)
}

const handleOfficeSelected = (id: string, name: string) => {
  selectedOffice.value = name
  isDivisionSelected.value = false
  divisions.value = []

  if (id !== '') {
    isOfficeSelected.value = true
    fetchDivisions(id)
    filters.office = id
  } else {
    filters.office = ''
    isOfficeSelected.value = false
  }

  handleDivisionSelected('', divisionPlaceholder)
}

const handleDivisionSelected = (id: string, name: string) => {
  selectedDivision.value = name
  isDepartmentSelected.value = false
  departments.value = []

  if (id !== '') {
    isDivisionSelected.value = true
    fetchDepartments(id)
    filters.division = id
  } else {
    filters.division = ''
    isDivisionSelected.value = false
  }

  handleDepartmentSelected('', departmentPlaceholder)
}

const handleDepartmentSelected = (id: string, name: string) => {
  selectedDepartment.value = name
  isGroupSelected.value = false
  groups.value = []

  if (id !== '') {
    isDepartmentSelected.value = true
    fetchGroups(id)
    filters.department = id
  } else {
    filters.department = ''
    isDepartmentSelected.value = false
  }

  handleGroupSelected('', groupPlaceholder)
}

const handleGroupSelected = (id: string, name: string) => {
  selectedGroup.value = name
  isGroupSelected.value = false

  if (id !== '') {
    isGroupSelected.value = true
    filters.group = id
  } else {
    filters.group = ''
    isGroupSelected.value = false
  }

  emit('filter-changed', { ...filters })
}
</script>
