export type Employee = {
  id: string
  name: string
  surname: string
  email: string
  phone_number?: string
  company_id: string
  office_id: string
  division_id: string
  department_id?: string
  group_id?: string
  photo?: File | string | null
  created_at: string
  updated_at: string
}
