import type { Office } from '../types/offices'
import PocketBase from 'pocketbase'

const pb = new PocketBase('http://127.0.0.1:8090')

export async function getFilteredOffices(id: string): Promise<{
  offices: Office[]
}> {
  try {
    const offices = await pb
      .collection('companies_offices')
      .getFullList<Office>(200, { filter: `company_id="${id}"`, sort: '-created' })
    return { offices }
  } catch (error) {
    console.log('Error in getConnectedToCompanies:', error)
    throw error
  }
}
