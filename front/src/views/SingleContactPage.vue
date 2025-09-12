<template>
  <div
    v-if="employee"
    class="mx-16 my-4 bg-white text-left font-extralight flex flex-col items-start gap-4"
  >
    <text class="text-[56px] text-text font-thin">Detalesnė kontaktų informacija</text>
    <div class="flex flex-row items-center pb-8 pt-4">
      <div class="w-24 h-24 rounded-full flex items-center justify-center mr-3">
        <img
          v-if="employee.photo"
          :src="getPhotoUrl(employee.photo)"
          :alt="employee.name + ' ' + employee.surname"
          class="w-24 h-24 rounded-full object-cover"
        />
        <img v-else :src="Profile" class="w-24 h-24" alt="Profile" />
      </div>
      <div>
        <h3 class="font-normal text-black text-5xl">
          {{ employee.name + ' ' + employee.surname || 'Vardas ir pavardė' }}
        </h3>
        <p class="text-2xl font-thin text-gray-500">
          Pozicija: {{ employee.position || 'Nėra duomenų' }}
        </p>
      </div>
    </div>

    <div class="w-full bg-white rounded-3xl shadow-md p-6 border border-gray-200">
      <div class="w-full grid grid-cols-1 md:grid-cols-2 my-4 justify-center">
        <div class="px-6 py-8 rounded-lg">
          <div class="w-full border-b border-gray-200 pb-4 mb-6">
            <h4 class="text-2xl font-medium text-black">Kontaktinės detalės:</h4>
          </div>
          <div class="space-y-6 text-xl">
            <div>
              <span class="text-text">Elektroninis paštas: </span>
              <a :href="`mailto:${employee.email}`" class="text-blue-600 hover:underline">
                {{ employee.email || 'example@teltonika.lt' }}
              </a>
            </div>
            <div>
              <span class="text-text">Telefono numeris: </span>
              <a :href="`tel:${employee.phone_number}`" class="text-blue-600 hover:underline">
                {{ employee.phone_number || '+00000000000' }}
              </a>
            </div>
          </div>
        </div>
        <div class="px-6 py-8 rounded-lg">
          <div class="w-full border-b border-gray-200 pb-4 mb-6">
            <h4 class="text-2xl font-medium text-black">Kompanijos detalės:</h4>
          </div>
          <div class="space-y-6 text-xl">
            <div>
              <span class="text-text">Kompanija: </span>
              <span class="text-gray-900">{{
                employee.expand.company_id.name || 'Trūksta duomenų'
              }}</span>
            </div>
            <div>
              <span class="text-text">Būstinė: </span>
              <span class="text-gray-900">{{
                employee.expand.office_id.name || 'Trūksta duomenų'
              }}</span>
            </div>
            <div>
              <span class="text-text">Padalinys: </span>
              <span class="text-gray-900">{{
                employee.expand.division_id.name || 'Trūksta duomenų'
              }}</span>
            </div>
            <div>
              <span class="text-text">Skyrius: </span>
              <span v-if="employee.expand.department_id" class="text-gray-900">{{
                employee.expand.department_id.name
              }}</span>
              <span v-else class="text-gray-900">Neturi</span>
            </div>
            <div>
              <span class="text-text">Grupė: </span>
              <span v-if="employee.expand.group_id" class="text-gray-900">{{
                employee.expand.group_id.name
              }}</span>
              <span v-else class="text-gray-900">Neturi</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="flex flex-col justify-center items-center h-screen bg-gray-50">
    <div class="bg-white rounded-2xl shadow-lg p-12 max-w-md text-center border border-gray-100">
      <h3 class="text-2xl font-semibold text-gray-800 mb-3">Duomenų nepavyko užkrauti</h3>
      <p class="text-gray-600 mb-6 leading-relaxed">
        Atsiprašome, bet darbuotojo duomenų nepavyko gauti. Bandykite dar kartą arba grįžkite į
        pagrindinį puslapį.
      </p>
      <div class="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          @click="$router.go(-1)"
          class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Grįžti atgal
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

import { getSingleEmployee } from '../services/employeeService'
import { getPhotoUrl } from '../utils/photoUtils'
import { useRouter } from 'vue-router'
import { useNotificationStore } from '../stores/Notification'

import Profile from '../assets/Profile.svg'

import type { Employee } from '../types/employees'

const employee = ref<Employee | null>(null)
const notificationStore = useNotificationStore()

const router = useRouter()

const props = defineProps<{
  id: string
}>()

onMounted(async () => {
  employee.value = await fetchEmployeeById(props.id)
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
    notificationStore.addErrorNotification('Nepavyko gauti darbuotojo duomenų.', error)
    return null
  }
}
</script>
