<template>
  <LoadingCard v-if="loading" class="w-full h-full justify-center items-center" />
  <div
    v-if="!loading"
    class="mx-16 my-4 bg-white text-left font-extralight flex flex-col items-start gap-4"
  >
    <text class="text-[56px] text-text font-thin">Kontaktų sistema</text>
    <SearchBar
      @change-count="updateEmployeesPerPage"
      @input-changed="updateSearchQuery"
      @change-view="updateViewType"
      @open-add-modal="
        handleOpenModal(AddEmployeeForm, userStore.permissions?.edit_employees || false, {})
      "
      :permissions="userStore.permissions?.edit_employees || false"
    />
    <text
      >Iš viso rasta:
      <span class="font-bold"
        >{{ totalEmployees }} {{ totalEmployees > 10 ? 'kontaktų' : 'kontaktai' }}</span
      ></text
    >
    <Filtering @filter-changed="updateFiltering" />
    <div v-if="employees.length === 0" class="w-full text-center text-2xl text-text font-bold">
      Nėra kontaktų
    </div>
    <CardDisplayType
      v-if="isCardView && employees.length > 0"
      :permissions="modalPermissions"
      :employees="employees"
      @open-edit-modal="handleEditModal($event)"
      @open-delete-modal="handleDeleteModal($event)"
    />
    <TableDisplayType
      v-if="!isCardView && employees.length > 0"
      :employees="employees"
      :permissions="modalPermissions"
      @open-edit-modal="handleEditModal($event)"
      @open-delete-modal="handleDeleteModal($event)"
    />
    <Pagination
      v-if="employeesPerPage !== SHOW_ALL_EMPLOYEES"
      @page-changed="updateCurrentPage"
      :current-page="currentPage"
      :total-pages="Math.ceil(totalEmployees / employeesPerPage)"
    />
  </div>
  <div v-if="!loading && !employees.length" class="flex flex-col justify-center items-center pt-48">
    <UnableToLoadCard />
  </div>
  <Modal ref="modalRef" @update="fetchEmployees" />
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

import { getEmployees } from '@/services/employeeService'

import SearchBar from '@/components/ui/SearchBar.vue'
import Filtering from '@/components/ui/Filtering.vue'
import Pagination from '@/components/ui/Pagination.vue'
import CardDisplayType from '@/components/tables/CardDisplayType.vue'
import TableDisplayType from '@/components/tables/TableDisplayType.vue'
import Modal from '@/components/ui/Modal.vue'
import AddEmployeeForm from '@/components/form/AddEmployeeForm.vue'
import EditEmployeeForm from '@/components/form/EditEmployeeForm.vue'
import DeleteEmployeeForm from '@/components/form/DeleteEmployeeForm.vue'
import LoadingCard from '@/components/ui/LoadingCard.vue'
import UnableToLoadCard from '@/components/cards/UnableToLoadCard.vue'

import { useUserStore } from '@/stores/Auth'
import { useNotificationStore } from '@/stores/Notification'

import type { Employee } from '@/types/employees'

const employees = ref<Employee[]>([])
const totalEmployees = ref(0)
const employeesPerPage = ref(__DEFAULT_EMPLOYEES_PER_PAGE__)
const currentPage = ref(__DEFAULT_CURRENT_PAGE__)
const searchQuery = ref('')
const isCardView = ref(true)
const filterQuery = ref<{ type: string; value: string | number }[]>([])
const notificationStore = useNotificationStore()
const modalRef = ref()
const userStore = useUserStore()
const SHOW_ALL_EMPLOYEES = __SHOW_ALL_EMPLOYEES__
const loading = ref(true)
const modalPermissions = computed(() => ({
  edit_employees: userStore.permissions?.edit_employees || false,
  delete_employees: userStore.permissions?.delete_employees || false,
}))

const emit = defineEmits(['update'])

onMounted(() => {
  fetchEmployees().then(() => {
    loading.value = false
  })
})

const fetchEmployees = async () => {
  try {
    const response = await getEmployees(
      employeesPerPage.value,
      currentPage.value,
      searchQuery.value,
      filterQuery.value
    )
    employees.value = response[0]
    totalEmployees.value = response[1]
    currentPage.value = response[2]
  } catch (error: any) {
    employees.value = []
    totalEmployees.value = 0
    currentPage.value = 1
    notificationStore.addErrorNotification('Nepavyko užkrauti kontaktų', error)
  }
}

const updateEmployees = () => {
  fetchEmployees()
}

const updateEmployeesPerPage = (count: number) => {
  employeesPerPage.value = count
  updateEmployees()
}

const updateSearchQuery = (query: string) => {
  searchQuery.value = query
  updateEmployees()
}

const updateCurrentPage = (page: number) => {
  currentPage.value = page
  updateEmployees()
}

const updateViewType = () => {
  isCardView.value = !isCardView.value
}

const updateFiltering = (filters: Record<string, string>) => {
  filterQuery.value = Object.entries(filters)
    .filter(([_, value]) => value !== '' && value !== 'ALL')
    .map(([type, value]) => ({ type, value }))
  fetchEmployees()
}

function handleEditModal(employee: Employee) {
  handleOpenModal(EditEmployeeForm, modalPermissions.value.edit_employees, { employee })
}

function handleDeleteModal(employee: Employee) {
  handleOpenModal(DeleteEmployeeForm, modalPermissions.value.delete_employees, { employee }, true)
}

const handleOpenModal = (
  ViewComponent: any,
  permissions: boolean,
  props: {},
  isDelete?: boolean
) => {
  if (!permissions) {
    notificationStore.addInfoNotification('Jūs neturite leidimo atlikti šį veiksmą')
    return
  }
  modalRef.value.open(ViewComponent, props, isDelete || false)
}
</script>
