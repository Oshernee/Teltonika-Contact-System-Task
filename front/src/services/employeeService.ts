import type { Employee } from '../types/employees'
import PocketBase from 'pocketbase'
import { ref } from 'vue'

const pb = new PocketBase('http://127.0.0.1:8090')

export async function getEmployees(
  perPage: number,
  page: number,
  searchQuery: string,
  filterQuery: { type: string; value: string | number }[] | null = null
): Promise<[Employee[], number, number]> {
  try {
    const filterConditions: string[] = []
    const currentPage = ref(page)

    if (filterQuery && filterQuery.length > 0) {
      filterQuery.forEach((f) => {
        filterConditions.push(`${f.type}_id="${f.value}"`)
      })
    }

    if (searchQuery) {
      searchQuery = searchQuery.replace(/"/g, '\\"')
      const searchCondition = `(name~"${searchQuery}" || surname~"${searchQuery}" || email~"${searchQuery}" || position~"${searchQuery}" || phone_number~"${searchQuery}")`
      filterConditions.push(searchCondition)
    }

    const filter = filterConditions.length > 0 ? filterConditions.join(' && ') : ''

    const records = await pb.collection('employees').getList<Employee>(page, perPage, {
      expand: 'office_id,company_id,division_id,department_id,group_id',
      filter: filter,
    })

    if (page > records.totalPages && records.totalPages > 0) {
      currentPage.value = records.totalPages
      return getEmployees(perPage, currentPage.value, searchQuery, filterQuery)
    }

    return [records.items, records.totalItems, currentPage.value]
  } catch (error) {
    throw error
  }
}
