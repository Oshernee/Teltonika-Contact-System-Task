import PocketBase from 'pocketbase'

// Initialize PocketBase client
const pb = new PocketBase('http://127.0.0.1:8090')

// Utility function to get a random item from an array
function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

export default async function createEmployee() {
  for (let i = 0; i < 1000; i++) {
    await createSingleEmployee()
  }
}

async function createSingleEmployee() {
  try {
    // Fetch all company records first
    const companies = await pb.collection('companies').getFullList()
    const company = getRandomItem(companies)

    // Get related offices through companies_offices junction table
    const companyOffices = await pb.collection('companies_offices').getFullList({
      filter: `company_id = "${company.id}"`,
      expand: 'office_id',
    })

    if (companyOffices.length === 0) {
      throw new Error('No offices found for this company')
    }
    const companyOffice = getRandomItem(companyOffices)
    const office = companyOffice.expand?.office_id

    // Get related divisions through offices_divisions junction table
    const officeDivisions = await pb.collection('offices_divisions').getFullList({
      filter: `office_id = "${office.id}"`,
      expand: 'division_id',
    })

    if (officeDivisions.length === 0) {
      throw new Error('No divisions found for this office')
    }
    const officeDivision = getRandomItem(officeDivisions)
    const division = officeDivision.expand?.division_id

    // Get related departments through divisions_departments junction table
    const divisionDepartments = await pb.collection('divisions_departments').getFullList({
      filter: `division_id = "${division.id}"`,
      expand: 'department_id',
    })

    if (divisionDepartments.length === 0) {
      throw new Error('No departments found for this division')
    }
    const divisionDepartment = getRandomItem(divisionDepartments)
    const department = divisionDepartment.expand?.department_id

    // Get related groups through departments_groups junction table
    const departmentGroups = await pb.collection('departments_groups').getFullList({
      filter: `department_id = "${department.id}"`,
      expand: 'group_id',
    })

    if (departmentGroups.length === 0) {
      throw new Error('No groups found for this department')
    }
    const departmentGroup = getRandomItem(departmentGroups)
    const group = departmentGroup.expand?.group_id

    // Generate random suffix for uniqueness
    const randomSuffix = Math.floor(Math.random() * 100000)
    const name = `Spaminius_${randomSuffix}`
    const surname = `Testington_${randomSuffix}`
    const email = `spaminius${randomSuffix}@example.com`
    const phone_number = `+3706${Math.floor(10000000 + Math.random() * 90000000)}`

    // Prepare employee data (using the correct field names from schema)
    const employeeData = {
      name,
      surname,
      email,
      phone_number,
      position: 'NPC',
      company_id: company.id,
      office_id: office.id,
      division_id: division.id,
      department_id: department.id,
      group_id: group.id,
    }

    // Create employee record
    const created = await pb.collection('employees').create(employeeData)

    console.log('✅ Employee created successfully:')
    console.log(created)
  } catch (error) {
    console.error('❌ Failed to create employee:', error)
  }
}
