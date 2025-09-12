import type { Company } from './companies'
import type { Office } from './offices'
import type { Division } from './divisions'
import type { Department } from './departments'
import type { Group } from './groups'

export type Employee = {
  id: string
  name: string
  surname: string
  email: string
  phone_number?: string
  position: string
  company_id: string
  office_id: string
  division_id: string
  department_id?: string
  group_id?: string
  photo?: File | string | null
  created_at: string
  updated_at: string
  expand: {
    office_id: Office
    company_id: Company
    division_id: Division
    department_id?: Department
    group_id?: Group
  }
}
