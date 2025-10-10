<template>
  <div
    v-if="!loading"
    class="mx-16 my-4 bg-white text-left font-extralight flex flex-col items-start gap-4 min-h-[85vh]"
  >
    <text class="text-[56px] text-text font-thin">Admin paskyros</text>
    <div v-if="permissions.edit_permissions" class="w-full flex items-center gap-8 text-xl">
      <button
        class="w-[56px] h-[56px] bg-accent rounded-full flex items-center justify-center hover:bg-accent-dark"
        @click="handleAddModal()"
      >
        <img :src="Add" alt="Add" class="w-8 h-8" />
      </button>
      Sukurti naują admin paskyrą
    </div>
    <div class="w-full text-center text-2xl pt-8 text-text font-bold">
      <UserTable
        :users="users"
        :permissions="{
          edit: permissions.edit_permissions,
          delete: permissions.delete_permissions,
        }"
        @open-edit-user-modal="handleUserEditModal($event)"
        @open-edit-permissions-modal="handlePermissionsEditModal($event)"
        @open-delete-modal="handleDeleteModal($event)"
      />
    </div>
    <div class="flex-grow"></div>
    <Pagination
      @page-changed="updateCurrentPage"
      :current-page="currentPage"
      :total-pages="Math.ceil(totalUsers / usersPerPage)"
      class="w-full pb-8"
    />
  </div>
  <div v-else class="w-full h-full flex justify-center items-center">
    <LoadingCard class="w-full h-full justify-center items-center" />
  </div>
  <Modal ref="modalRef" @update="fetchUsers" />
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import type { User } from '@/types/users'

import { DEFAULT_CONSTANTS } from '@/constants/defaultConstants'

import Add from '@/assets/Add.svg'
import Modal from '@/components/ui/Modal.vue'

import { useUserStore } from '@/stores/Auth'
import { useNotificationStore } from '@/stores/Notification'

import AddUserForm from '@/components/form/AddUserForm.vue'
import EditUserForm from '@/components/form/EditUserForm.vue'
import EditPermissionsForm from '@/components/form/EditPermissionsForm.vue'
import DeleteUserForm from '@/components/form/DeleteUserForm.vue'
import LoadingCard from '@/components/ui/LoadingCard.vue'
import Pagination from '@/components/ui/Pagination.vue'
import UserTable from '@/components/tables/UserTable.vue'

import { getUserPermissions, getUsers } from '@/services/userService'

const users = ref<User[]>([])
const totalUsers = ref(0)
const usersPerPage = ref(4)
const currentPage = ref(DEFAULT_CONSTANTS.DEFAULT_CURRENT_PAGE)
const loading = ref(true)
const notificationStore = useNotificationStore()
const modalRef = ref()
const userStore = useUserStore()
const permissions = computed(() => ({
  edit_permissions: userStore.permissions?.edit_permissions || false,
  delete_permissions: userStore.permissions?.delete_permissions || false,
}))

const emit = defineEmits(['update'])

onMounted(() => {
  fetchUsers().then(() => {
    loading.value = false
  })
})

const fetchUsers = async () => {
  try {
    const response = await getUsers(currentPage.value, usersPerPage.value)
    users.value = response[0]
    totalUsers.value = response[1]
    currentPage.value = response[2]
  } catch (error: any) {
    notificationStore.addErrorNotification('Nepavyko užkrauti vartotojų', error)
  }
}

const updateUsers = () => {
  fetchUsers()
}

const updateCurrentPage = (page: number) => {
  currentPage.value = page
  updateUsers()
}

function handleAddModal() {
  handleOpenModal(AddUserForm, permissions.value.edit_permissions, {})
}

function handleUserEditModal(user: User) {
  handleOpenModal(EditUserForm, permissions.value.edit_permissions, { user })
}

async function handlePermissionsEditModal(user: User) {
  const userPermissions = await getUserPermissions(user.permissions_id)
  handleOpenModal(EditPermissionsForm, permissions.value.edit_permissions, {
    user,
    permissions: userPermissions,
  })
}

function handleDeleteModal(user: User) {
  handleOpenModal(DeleteUserForm, permissions.value.delete_permissions, { user }, true)
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
