import type { FilterLevel } from '@/types/filter'
import axios from 'axios'
import pb from '@/services/globalInstance'

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
    // 'base_url/api/collections/{filterLevel.targetCollection}/records/{id}?expand={filterLevel.linkCollection}({filterLevel.linkField}).{filterLevel.targetField}'

    const filteredItems = await axios
      .get(
        `base_url/api/collections/${filterLevel.targetCollection}/records/${id}?expand=${filterLevel.linkCollection}(${filterLevel.linkField}).${filterLevel.targetField}`
      )
      .then((response) => {
        if (!response.data.expand) {
          return []
        }
        return response.data.expand[`${filterLevel.linkCollection}(${filterLevel.linkField})`].map(
          (item: any) => item.expand[filterLevel.targetField]
        )
      })
    return filteredItems
  } catch (error) {
    throw error
  }
}

export async function deleteRecordById(collectionName: string, id: string): Promise<void> {
  try {
    await pb.collection(collectionName).delete(id)
  } catch (error) {
    throw error
  }
}
