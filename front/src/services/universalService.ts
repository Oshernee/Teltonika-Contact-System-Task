import type { Employee } from '../types/employees'
import type { Company } from '../types/companies'
import type { Office } from '../types/offices'
import type { Division } from '../types/divisions'
import type { Department } from '../types/departments'
import type { Group } from '../types/groups'
import PocketBase from 'pocketbase'

const pb = new PocketBase('http://127.0.0.1:8090')

export async function GetIDByName(collectionName: string, name: string): Promise<string> {
  try {
    const records = await pb
      .collection(collectionName)
      .getFullList<{ id: string; name: string }>(200, {
        filter: `name="${name.replace(/"/g, '\\"')}"`,
      })
    if (records.length > 0) {
      return records[0].id
    }
    return ''
  } catch (error) {
    console.log(`Error in GetIDByName for collection ${collectionName}:`, error)
    throw error
  }
}

export async function getNamesByCollection(
  collectionName: string
): Promise<{ id: string; name: string }[]> {
  try {
    const records = await pb
      .collection(collectionName)
      .getFullList<{ id: string; name: string }>(200)
    return records
  } catch (error) {
    console.log(`Error in getNamesByCollection for collection ${collectionName}:`, error)
    throw error
  }
}
