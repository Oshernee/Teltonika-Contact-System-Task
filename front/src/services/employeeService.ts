import type { Employee } from '@/types/employees'
import { ref } from 'vue'
import pb from '@/services/globalInstance'
import type { RecordModel } from 'pocketbase'

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

export async function getSingleEmployee(id: string): Promise<Employee> {
  try {
    const record = await pb.collection('employees').getOne<Employee>(id, {
      expand: 'office_id,company_id,division_id,department_id,group_id',
    })
    return record
  } catch (error) {
    throw error
  }
}

export async function checkEmailExists(email: string): Promise<boolean> {
  try {
    const resultList = await pb.collection('employees').getFullList({
      filter: `email = "${email}"`,
    })
    return resultList.length === 0
  } catch (error) {
    throw error
  }
}

export async function createEmployee(
  name: string,
  surname: string,
  position: string,
  email: string,
  phone: string | null,
  company: string,
  office: string,
  division: string,
  department: string | null,
  group: string | null,
  image: File | string | null = null
): Promise<RecordModel> {
  try {
    const data = {
      name,
      surname,
      email,
      phone_number: phone,
      position,
      company_id: company,
      office_id: office,
      division_id: division,
      department_id: department,
      group_id: group,
      photo: image,
    }

    const record = await pb.collection('employees').create(data)
    return record
  } catch (error) {
    throw error
  }
}

export async function updateEmployee(
  id: string,
  name: string,
  surname: string,
  position: string,
  email: string,
  phone: string | null,
  company: string,
  office: string,
  division: string,
  department: string | null,
  group: string | null,
  image: File | string | null = null
): Promise<RecordModel> {
  try {
    const data = {
      name,
      surname,
      email,
      phone_number: phone,
      position,
      company_id: company,
      office_id: office,
      division_id: division,
      department_id: department,
      group_id: group,
      photo: image,
    }

    const record = await pb.collection('employees').update(id, data)
    return record
  } catch (error) {
    throw error
  }
}
