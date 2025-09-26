<template>
  <div v-if="!loading">
    <div
      v-if="employee"
      class="mx-16 my-4 bg-white text-left font-extralight flex flex-col items-start"
    >
      <text class="text-[56px] text-text font-thin">Detalesnė kontaktų informacija</text>
      <ReturnButton />
      <div class="flex flex-row items-center py-8 px-4">
        <img
          v-if="employee.photo"
          :src="photo"
          :alt="employee.name + ' ' + employee.surname"
          class="w-24 h-24 rounded-full object-cover mr-4"
        />
        <img v-else :src="Profile" class="w-24 h-24 rounded-full object-cover mr-4" alt="Profile" />
        <div>
          <h3 class="font-normal text-black text-5xl">
            {{ employee.name + ' ' + employee.surname || 'Vardas ir pavardė' }}
          </h3>
          <p class="text-2xl font-thin text-gray-500">Pozicija: {{ employee.position || '-' }}</p>
        </div>
      </div>
      <ContactInformationCard :employee="employee" />
    </div>
    <div v-else="!employee" class="flex flex-col justify-center items-center pt-48">
      <UnableToLoadCard />
    </div>
  </div>

  <div v-else="loading" class="flex flex-col justify-center items-center pt-48">
    <text class="text-2xl text-text font-thin">Kraunama...</text>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

import { getSingleEmployee } from '../services/employeeService'
import { useRouter } from 'vue-router'
import { useNotificationStore } from '../stores/Notification'
import { DEFAULT_CONSTANTS } from '../constants/defaultConstants'

import Profile from '../assets/Profile.svg'

import { getPhotoUrl } from '../utils/photoUtils'

import type { Employee } from '../types/employees'

import ReturnButton from '../components/ReturnButton.vue'
import UnableToLoadCard from '../components/UnableToLoadCard.vue'
import ContactInformationCard from '../components/ContactInformationCard.vue'

const constants = DEFAULT_CONSTANTS
const employee = ref<Employee | null>(null)
const notificationStore = useNotificationStore()
const loading = ref(true)
const photo = ref<string | undefined>(undefined)

const router = useRouter()

const props = defineProps<{
  id: string
}>()

onMounted(async () => {
  employee.value = await fetchEmployeeById(props.id)
  if (!employee.value?.photo) {
    loading.value = false
    return
  }
  photo.value = await getPhotoUrl(
    employee.value?.photo,
    constants.EMPLOYEE_IMAGE_API + employee.value?.id
  )
  loading.value = false
})

const fetchEmployeeById = async (id: string) => {
  try {
    const response = await getSingleEmployee(id)
    return response
  } catch (error: any) {
    if (error.response && error.response.code === 404) {
      router.push('/not-found')
      return null
    }
    loading.value = false
    notificationStore.addErrorNotification('Nepavyko gauti darbuotojo duomenų.', error)
    return null
  }
}
</script>
