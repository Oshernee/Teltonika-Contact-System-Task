import type { Company } from '../types/companies'
import PocketBase from 'pocketbase'

const pb = new PocketBase('http://127.0.0.1:8090')

export async function getCompanies(): Promise<Company[]> {
  try {
    const records = await pb.collection('companies').getFullList<Company>(200, {
      sort: '-created',
    })
    return records
  } catch (error) {
    console.log('Error in getConnectedCompanies:', error)
    throw error
  }
}
