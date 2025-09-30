<template>
  <div
    v-if="!loading"
    class="mx-16 my-4 bg-white text-left font-extralight flex flex-col items-start gap-4 min-h-[85vh]"
  >
    <text class="text-[56px] text-text font-thin">Įmonės</text>
    <div v-if="permissions.edit_companies" class="w-full flex items-center gap-8 text-xl">
      <button
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
        >{{ totalCompanies }} {{ totalCompanies > 10 ? 'įmonių' : 'įmonės' }}</span
      ></text
    >
    <div v-if="companies.length === 0" class="w-full text-center text-2xl text-text font-bold">
      Nėra įmonių
    </div>
    <div v-else class="w-full text-center text-2xl text-text font-bold">
      <CompaniesTable
        :structures="companies"
        :permissions="{
          edit: permissions.edit_companies,
          delete: permissions.delete_companies,
        }"
        @open-edit-modal="handleEditModal($event)"
        @open-delete-modal="handleDeleteModal($event)"
      />
    </div>
    <div class="flex-grow"></div>
    <Pagination
      @page-changed="updateCurrentPage"
      :current-page="currentPage"
      :total-pages="Math.ceil(totalCompanies / companiesPerPage)"
      class="w-full pb-8"
    />
  </div>
  <div v-else class="w-full h-full flex justify-center items-center">
    <LoadingCard class="w-full h-full justify-center items-center" />
  </div>
  <Modal ref="modalRef" @update="fetchCompanies" />
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

import { getStructures } from '@/services/universalService'

import { DEFAULT_CONSTANTS } from '@/constants/defaultConstants'
import { STRUCTURE_CONSTANTS } from '@/constants/structureConstants'
import { FILTER_LEVELS } from '@/constants/filteringConstants'

import Add from '@/assets/Add.svg'
import Modal from '@/components/ui/Modal.vue'

import { useUserStore } from '@/stores/Auth'
import { useNotificationStore } from '@/stores/Notification'

import type { Structure } from '@/types/structures'

import AddCompanyForm from '@/components/form/AddCompanyForm.vue'
import EditCompanyForm from '@/components/form/EditCompanyForm.vue'
import DeleteCompanyForm from '@/components/form/DeleteCompanyForm.vue'
import LoadingCard from '@/components/cards/LoadingCard.vue'
import Pagination from '@/components/ui/Pagination.vue'
import CompaniesTable from '@/components/tables/CompaniesTable.vue'

const companies = ref<Structure[]>([])
const totalCompanies = ref(0)
const companiesPerPage = ref(4)
const currentPage = ref(DEFAULT_CONSTANTS.DEFAULT_CURRENT_PAGE)
const constants = STRUCTURE_CONSTANTS.companies
const loading = ref(true)
const notificationStore = useNotificationStore()
const modalRef = ref()
const userStore = useUserStore()
const permissions = computed(() => ({
  edit_companies: userStore.permissions?.edit_companies || false,
  delete_companies: userStore.permissions?.delete_companies || false,
}))

const emit = defineEmits(['update'])

onMounted(() => {
  fetchCompanies().then(() => {
    loading.value = false
  })
})

const fetchCompanies = async () => {
  try {
    const response = await getStructures('companies', currentPage.value, companiesPerPage.value)
    companies.value = response[0]
    totalCompanies.value = response[1]
    currentPage.value = response[2]
  } catch (error: any) {
    notificationStore.addErrorNotification('Nepavyko užkrauti kompanijų', error)
  }
}

const updateCompanies = () => {
  fetchCompanies()
}

const updateCurrentPage = (page: number) => {
  currentPage.value = page
  updateCompanies()
}

function handleAddModal() {
  handleOpenModal(AddCompanyForm, permissions.value.edit_companies, { constants })
}

function handleEditModal(structure: Structure) {
  handleOpenModal(EditCompanyForm, permissions.value.edit_companies, { structure, constants })
}

function handleDeleteModal(structure: Structure) {
  handleOpenModal(
    DeleteCompanyForm,
    permissions.value.delete_companies,
    { structure, constants, filterLevel: FILTER_LEVELS.offices },
    true
  )
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
