<template>
  <div class="mx-16 my-4 bg-white text-left font-extralight flex flex-col items-start gap-4">
    <text class="text-[56px] text-text font-thin">Įmonės</text>
    <div class="w-full flex items-center gap-8 text-xl">
      <button
        v-if="modalPermissions.edit_companies"
        class="w-[56px] h-[56px] bg-accent rounded-full flex items-center justify-center hover:bg-accent-dark"
        @click="handleAddModal()"
      >
        <img :src="Add" alt="Add" class="w-8 h-8" />
      </button>
      Pridėti naują įmonę
    </div>
    <text
      >Iš viso rasta:
      <span class="font-bold"
        >{{ totalEmployees }} {{ totalEmployees > 10 ? 'įmonių' : 'įmonės' }}</span
      ></text
    >
    <div v-if="employees.length === 0" class="w-full text-center text-2xl text-text font-bold">
      Nėra įmonių
    </div>
    <div
      v-else
      :class="isCardView ? 'grid grid-cols-4 gap-4 w-full' : 'flex flex-col gap-4 w-full'"
    ></div>
    <Pagination
      v-if="employeesPerPage !== DEFAULT_CONSTANTS.SHOW_ALL_EMPLOYEES"
      @page-changed="updateCurrentPage"
      :current-page="currentPage"
      :total-pages="Math.ceil(totalEmployees / employeesPerPage)"
    />
  </div>
  <Modal ref="modalRef" @update="fetchEmployees" />
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

import { getEmployees } from '@/services/employeeService'

import { DEFAULT_CONSTANTS } from '@/constants/defaultConstants'

import Add from '@/assets/Add.svg'
import Modal from '@/components/ui/Modal.vue'
import Pagination from '@/components/ui/Pagination.vue'

import { useUserStore } from '@/stores/Auth'
import { useNotificationStore } from '@/stores/Notification'

import type { Employee } from '@/types/employees'

import AddCompanyForm from '@/components/form/AddCompanyForm.vue'
import EditCompanyForm from '@/components/form/EditCompanyForm.vue'
import DeleteCompanyForm from '@/components/form/DeleteCompanyForm.vue'

const employees = ref<Employee[]>([])
const totalEmployees = ref(0)
const employeesPerPage = ref(DEFAULT_CONSTANTS.DEFAULT_EMPLOYEES_PER_PAGE)
const currentPage = ref(DEFAULT_CONSTANTS.DEFAULT_CURRENT_PAGE)
const searchQuery = ref('')
const isCardView = ref(true)
const filterQuery = ref<{ type: string; value: string | number }[]>([])
const notificationStore = useNotificationStore()
const modalRef = ref()
const userStore = useUserStore()
const modalPermissions = computed(() => ({
  edit_companies: userStore.permissions?.edit_companies || false,
  delete_companies: userStore.permissions?.delete_companies || false,
}))

const emit = defineEmits(['update'])

onMounted(() => {
  fetchEmployees()
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

function handleAddModal() {
  handleOpenModal(AddCompanyForm, modalPermissions.value.edit_companies, {})
}

function handleEditModal(employee: Employee) {
  handleOpenModal(EditCompanyForm, modalPermissions.value.edit_companies, { employee })
}

function handleDeleteModal(employee: Employee) {
  handleOpenModal(DeleteCompanyForm, modalPermissions.value.delete_companies, { employee }, true)
}

const handleOpenModal = (
  ViewComponent: any,
  permissions: boolean,
  props: {},
  isDelete?: boolean
) => {
  if (!permissions) {
    notificationStore.addInfoNotification(DEFAULT_CONSTANTS.UNAUTHORIZED_MESSAGE)
    return
  }
  modalRef.value.open(ViewComponent, props, isDelete || false)
}
</script>
