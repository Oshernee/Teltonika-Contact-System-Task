<template>
  <div class="mx-16 my-4 bg-gray-50 text-left font-extralight flex flex-col items-start gap-4">
    <text class="text-[56px] text-gray-900 font-thin">Kontaktų sistema</text>
    <SearchBar
      @change-count="updateEmployeesPerPage"
      @input-changed="updateSearchQuery"
      @change-view="updateViewType"
    />
    <text
      >Iš viso rasta:
      <span class="font-bold"
        >{{ totalEmployees }} {{ totalEmployees > 10 ? 'kontaktų' : 'kontaktai' }}</span
      ></text
    >
    <Filtering :employees="employees" />
    <CardDisplayType :employees="employees" v-if="isCardView" />
    <TableDisplayType :employees="employees" v-if="!isCardView" />
    <Pagination
      @page-changed="updateCurrentPage"
      :current-page="currentPage"
      :total-pages="Math.ceil(totalEmployees / employeesPerPage)"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

import { getEmployees } from '../services/employeeService'

import SearchBar from '../components/SearchBar.vue'
import Filtering from '../components/Filtering.vue'
import CardDisplayType from '../components/CardDisplayType.vue'
import TableDisplayType from '../components/TableDisplayType.vue'
import Pagination from '../components/Pagination.vue'

import type { Employee } from '../types/employees'

const employees = ref<Employee[]>([])
const totalEmployees = ref(0)
const employeesPerPage = ref(5)
const currentPage = ref(1)
const searchQuery = ref('')
const isCardView = ref(true)

onMounted(() => {
  fetchEmployees()
})

const fetchEmployees = async () => {
  try {
    const response = await getEmployees(
      employeesPerPage.value,
      currentPage.value,
      searchQuery.value
    )
    console.log(response)
    employees.value = response[0]
    totalEmployees.value = response[1]
  } catch (error) {
    console.error('Klaida gaunant darbuotojus:', error)
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
</script>
