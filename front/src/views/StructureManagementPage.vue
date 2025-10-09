<template>
  <LoadingCard v-if="loading" class="w-full h-full justify-center items-center" />
  <div
    v-if="!loading"
    class="mx-16 my-4 bg-white text-left font-extralight flex flex-col items-start gap-4 min-h-[85vh]"
  >
    <text class="text-[56px] text-text font-thin">Struktūra</text>
    <div v-if="permissions.edit" class="w-full flex items-center gap-8 text-xl">
      <button
        class="w-[56px] h-[56px] bg-accent rounded-full flex items-center justify-center hover:bg-accent-dark"
        @click="handleAddModal()"
      >
        <img :src="Add" alt="Add" class="w-8 h-8" />
      </button>
      Pridėti naują struktūrą
    </div>
    <StructureSelector class="w-full" @structure-selected="handleStructureSelected" />
    <div v-if="structures.length === 0" class="w-full text-center text-2xl text-text font-bold">
      Nėra struktūrų
    </div>
    <div v-else class="w-full text-center text-2xl text-text font-bold">
      <StructuresTable
        :structures="structures"
        :structure-type="selectedStructureType"
        :permissions="{
          edit: permissions.edit,
          delete: permissions.delete,
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
  <div
    v-if="!loading && !structures.length"
    class="flex flex-col justify-center items-center pt-48"
  >
    <UnableToLoadCard />
  </div>
  <Modal ref="modalRef" @update="fetchStructures" />
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

import { getStructures, getConnectionById } from '@/services/universalService'

import { CHECK_LOWER_CONSTRAINTS, STRUCTURE_CONSTANTS } from '@/constants/structureConstants'

import Add from '@/assets/Add.svg'
import Modal from '@/components/ui/Modal.vue'

import { useUserStore } from '@/stores/Auth'
import { useNotificationStore } from '@/stores/Notification'

import type { Structure } from '@/types/structures'

import AddStructureForm from '@/components/form/AddStructureForm.vue'
import EditStructureForm from '@/components/form/EditStructureForm.vue'

import AddOfficeForm from '@/components/form/AddOfficeForm.vue'
import EditOfficeForm from '@/components/form/EditOfficeForm.vue'

import DeleteStructureForm from '@/components/form/DeleteStructureForm.vue'

import LoadingCard from '@/components/ui/LoadingCard.vue'
import UnableToLoadCard from '@/components/cards/UnableToLoadCard.vue'
import Pagination from '@/components/ui/Pagination.vue'
import StructuresTable from '@/components/tables/StructuresTable.vue'
import StructureSelector from '@/components/ui/StructureSelector.vue'

const selectedStructureType = ref('offices')
const structures = ref<Structure[]>([])
const upperStructures = ref<Structure[]>([])
const totalCompanies = ref(0)
const companiesPerPage = ref(4)
const currentPage = ref(__DEFAULT_CURRENT_PAGE__)
const loading = ref(true)
const notificationStore = useNotificationStore()
const modalRef = ref()
const userStore = useUserStore()
const key = ['companies', 'offices', 'divisions', 'departments', 'groups'] as const

const emit = defineEmits(['update'])

const constants = computed(() => STRUCTURE_CONSTANTS[selectedStructureType.value])

const editPermission = computed(
  () =>
    'edit_' +
    (key.includes(selectedStructureType.value as any) ? 'structure' : selectedStructureType.value)
)

const deletePermission = computed(
  () =>
    'delete_' +
    (key.includes(selectedStructureType.value as any) ? 'structure' : selectedStructureType.value)
)

const permissions = computed(() => ({
  edit: (userStore.permissions?.[editPermission.value] as boolean) ?? false,
  delete: (userStore.permissions?.[deletePermission.value] as boolean) ?? false,
}))

onMounted(async () => {
  try {
    await fetchStructures()
  } catch (error) {
    notificationStore.addErrorNotification('Nepavyko užkrauti duomenų', error)
  } finally {
    loading.value = false
  }
})

const fetchStructures = async () => {
  try {
    const response = await getStructures(
      selectedStructureType.value,
      currentPage.value,
      companiesPerPage.value
    )
    const upperStructureResponse = await getStructures(
      key[key.indexOf(selectedStructureType.value as (typeof key)[number]) - 1],
      1,
      1000
    )
    structures.value = response[0]
    totalCompanies.value = response[1]
    currentPage.value = response[2]
    upperStructures.value = upperStructureResponse[0]
  } catch (error: any) {
    notificationStore.addErrorNotification('Nepavyko užkrauti struktūrų', error)
  }
}

const updateStructures = () => {
  fetchStructures()
}

const updateCurrentPage = (page: number) => {
  currentPage.value = page
  updateStructures()
}

const handleStructureSelected = (structure: string) => {
  currentPage.value = 1
  selectedStructureType.value = structure
  updateStructures()
}

function handleAddModal() {
  handleOpenModal(
    selectedStructureType.value === 'offices' ? AddOfficeForm : AddStructureForm,
    permissions.value.edit,
    {
      constants,
      filterLevel: CHECK_LOWER_CONSTRAINTS[selectedStructureType.value],
      upperStructures: upperStructures.value,
    }
  )
}

async function handleEditModal(structure: Structure) {
  const selectedUpperStructure = await getConnectionById(
    structure.id,
    constants.value.structure_type,
    constants.value.upper_structure_type
  )
  handleOpenModal(
    selectedStructureType.value === 'offices' ? EditOfficeForm : EditStructureForm,
    permissions.value.edit,
    {
      structure,
      selectedUpperStructure,
      constants,
      filterLevel: CHECK_LOWER_CONSTRAINTS[selectedStructureType.value],
      upperStructures: upperStructures.value,
    }
  )
}

function handleDeleteModal(structure: Structure) {
  handleOpenModal(
    DeleteStructureForm,
    permissions.value.delete,
    {
      structure,
      constants,
      filterLevel: CHECK_LOWER_CONSTRAINTS[selectedStructureType.value],
      upperStructureName: key[key.indexOf(selectedStructureType.value as (typeof key)[number]) - 1],
    },
    true
  )
}

const handleOpenModal = (
  ViewComponent: any,
  hasPermission: boolean,
  props: {},
  isDelete?: boolean
) => {
  if (!hasPermission) {
    notificationStore.addInfoNotification('Jūs neturite leidimo atlikti šį veiksmą')
    return
  }
  modalRef.value.open(ViewComponent, props, isDelete || false)
}
</script>
