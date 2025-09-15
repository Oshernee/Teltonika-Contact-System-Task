import type { FilterLevel } from '../types/filter'
import pb from '../utils/globalInstance'

export async function getIdByName(collectionName: string, name: string): Promise<string> {
  try {
    const records = await pb
      .collection(collectionName)
      .getFullList(200, { filter: `name="${name}"` })
    if (records.length > 0) {
      return records[0].id
    }
    return ''
  } catch (error) {
    throw error
  }
}

export async function getLowerFilteredItems(filterLevel: FilterLevel, id: string): Promise<any[]> {
  try {
    const links = await pb
      .collection(filterLevel.linkCollection)
      .getFullList(200, { filter: `${filterLevel.linkField}="${id}"`, sort: '-created' })
    const targetData = await pb
      .collection(filterLevel.targetCollection)
      .getFullList(200, { sort: '-created' })
    const filteredItems = targetData.filter((item) =>
      links.some((link) => link[filterLevel.targetField] === item.id)
    )
    return filteredItems
  } catch (error) {
    throw error
  }
}
