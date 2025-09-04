import type { Employee } from '../types/employees'
import PocketBase from 'pocketbase'

const pb = new PocketBase('http://127.0.0.1:8090')

export async function getEmployees(
  perPage: number,
  page: number,
  searchQuery: string
): Promise<[Employee[], number]> {
  try {
    const filterConditions: string[] = []

    if (searchQuery) {
      searchQuery = searchQuery.replace(/"/g, '\\"')
      const searchCondition = `name~"${searchQuery}" || surname~"${searchQuery}" || email~"${searchQuery}" || position~"${searchQuery}" || phone_number~"${searchQuery}"`
      filterConditions.push(searchCondition)
    }

    const filter = filterConditions.length > 0 ? filterConditions.join(' && ') : ''

    const records = await pb.collection('employees').getList<Employee>(page, perPage, {
      expand: 'office_id,company_id,division_id,department_id,group_id',
      filter: filter,
    })

    return [records.items, records.totalItems]
  } catch (error) {
    console.log('Error in getEmployees:', error)
    throw error
  }
}
