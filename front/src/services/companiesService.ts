import type { Company } from '@/types/companies'
import pb from '@/services/globalInstance'

export async function getCompanies(): Promise<Company[]> {
  try {
    const records = await pb.collection('companies').getFullList<Company>(200, {
      sort: '-created',
    })
    return records
  } catch (error) {
    throw error
  }
}
