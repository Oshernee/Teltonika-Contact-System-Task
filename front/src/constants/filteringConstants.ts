import type { FilterLevel } from '../types/filter'

export const PLACEHOLDERS = {
  company: 'Pasirinkite įmonę',
  office: 'Pasirinkite ofisą',
  division: 'Pasirinkite padalinį',
  department: 'Pasirinkite skyrių',
  group: 'Pasirinkite grupę',
} as const

export const ERROR_MESSAGES = {
  company: 'Klaida gaunant įmones',
  office: 'Klaida gaunant ofisus',
  division: 'Klaida gaunant padalinius',
  department: 'Klaida gaunant skyrius',
  group: 'Klaida gaunant grupes',
} as const

export const FILTER_LEVELS: Record<string, FilterLevel> = {
  offices: {
    linkCollection: 'companies_offices',
    targetCollection: 'offices',
    linkField: 'company_id',
    targetField: 'office_id',
  },
  divisions: {
    linkCollection: 'offices_divisions',
    targetCollection: 'divisions',
    linkField: 'office_id',
    targetField: 'division_id',
  },
  departments: {
    linkCollection: 'divisions_departments',
    targetCollection: 'departments',
    linkField: 'division_id',
    targetField: 'department_id',
  },
  groups: {
    linkCollection: 'departments_groups',
    targetCollection: 'groups',
    linkField: 'department_id',
    targetField: 'group_id',
  },
}
