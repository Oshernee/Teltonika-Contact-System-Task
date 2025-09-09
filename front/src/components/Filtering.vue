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
import { onMounted, ref } from 'vue'

import { getIdByName } from '../services/universalService'
import { getCompanies } from '../services/companiesService'
import { getFilteredOffices } from '../services/officesService'

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

const companies = ref<{ id: number | string; name: string }[]>([])
const offices = ref<{ id: number | string; name: string }[]>([])
const divisions = ref<{ id: number | string; name: string }[]>([])
const departments = ref<{ id: number | string; name: string }[]>([])
const groups = ref<{ id: number | string; name: string }[]>([])

const emit = defineEmits<{
  'filter-changed': [filterType: string, value: string | number]
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
    const officesData = await getFilteredOffices(companyId)
    offices.value = officesData.offices
      .map((office) => ({ id: office.id, name: office.name }))
      .filter((item): item is { id: string; name: string } => item !== undefined)
  } catch (error) {
    console.error('Klaida gaunant ofisus:', error)
  }
}

const handleCompanySelected = (selectedCompany: { id: number | string; name: string }) => {
  isCompanySelected.value = true
  isOfficeSelected.value = false
  isDivisionSelected.value = false
  isDepartmentSelected.value = false

  officePlaceholder.value = 'Pasirinkite ofisą'
  divisionPlaceholder.value = 'Pasirinkite padalinį'
  departmentPlaceholder.value = 'Pasirinkite skyrių'
  groupPlaceholder.value = 'Pasirinkite grupę'

  offices.value = []
  divisions.value = []
  departments.value = []
  groups.value = []

  fetchOffices(selectedCompany.id.toString())

  emit('filter-changed', 'company', selectedCompany.id)
}

const handleOfficeSelected = (selectedOffice: { id: number | string; name: string }) => {
  isOfficeSelected.value = true
  isDivisionSelected.value = false
  isDepartmentSelected.value = false

  divisionPlaceholder.value = 'Pasirinkite padalinį'
  departmentPlaceholder.value = 'Pasirinkite skyrių'
  groupPlaceholder.value = 'Pasirinkite grupę'

  divisions.value = []
  departments.value = []
  groups.value = []

  emit('filter-changed', 'office', selectedOffice.id)
}

const handleDivisionSelected = (selectedDivision: { id: number | string; name: string }) => {
  isDivisionSelected.value = true
  isDepartmentSelected.value = false

  departmentPlaceholder.value = 'Pasirinkite skyrių'
  groupPlaceholder.value = 'Pasirinkite grupę'

  departments.value = []
  groups.value = []

  emit('filter-changed', 'division', selectedDivision.id)
}

const handleDepartmentSelected = (selectedDepartment: { id: number | string; name: string }) => {
  isDepartmentSelected.value = true

  groupPlaceholder.value = 'Pasirinkite grupę'

  groups.value = []

  emit('filter-changed', 'department', selectedDepartment.name)
}

const handleGroupSelected = (selectedGroup: { id: number | string; name: string }) => {
  emit('filter-changed', 'group', selectedGroup.id)
}
</script>
