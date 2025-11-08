export const STRUCTURE_CONSTANTS: Record<string, any> = {
  companies: {
    type_accusative: 'įmonę',
    type_genitive: 'Įmonės',
    structure_type: 'companies',
    upper_structure_type: '',
  },
  offices: {
    type_accusative: 'ofisą',
    type_genitive: 'Ofiso',
    structure_type: 'offices',
    upper_structure_type: 'companies',
    upper_structure_type_plural: 'Įmonės',
  },
  divisions: {
    type_accusative: 'padalinį',
    type_genitive: 'Padalinio',
    structure_type: 'divisions',
    upper_structure_type: 'offices',
    upper_structure_type_plural: 'Ofisai',
  },
  departments: {
    type_accusative: 'skyrių',
    type_genitive: 'Skyrius',
    structure_type: 'departments',
    upper_structure_type: 'divisions',
    upper_structure_type_plural: 'Padaliniai',
  },
  groups: {
    type_accusative: 'grupę',
    type_genitive: 'Grupės',
    structure_type: 'groups',
    upper_structure_type: 'departments',
    upper_structure_type_plural: 'Skyriai',
  },
}

export const CHECK_LOWER_CONSTRAINTS: Record<string, any> = {
  companies: {
    linkCollection: 'companies_offices',
    linkField: 'company_id',
    targetCollection: 'offices',
    targetField: 'office_id',
  },
  offices: {
    linkCollection: 'offices_divisions',
    linkField: 'office_id',
    targetCollection: 'divisions',
    targetField: 'division_id',
  },
  divisions: {
    linkCollection: 'divisions_departments',
    linkField: 'division_id',
    targetCollection: 'departments',
    targetField: 'department_id',
  },
  departments: {
    linkCollection: 'departments_groups',
    linkField: 'department_id',
    targetCollection: 'groups',
    targetField: 'group_id',
  },
  groups: {
    linkCollection: '',
    linkField: '',
    targetCollection: '',
    targetField: '',
  },
}
