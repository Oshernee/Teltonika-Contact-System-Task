import type { FilterLevel } from '@/types/filter'
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

export async function deleteRecordById(collectionName: string, id: string): Promise<void> {
  try {
    await pb.collection(collectionName).delete(id)
  } catch (error) {
    throw error
  }
}

export async function getStructures(
  collectionName: string,
  currentPage: number,
  itemsPerPage: number
): Promise<any> {
  try {
    const records = await pb.collection(collectionName).getList(currentPage, itemsPerPage)

    if (currentPage > records.totalPages && records.totalPages > 0) {
      currentPage = records.totalPages
      return getStructures(collectionName, currentPage, itemsPerPage)
    }
    console.log(records)

    return [records.items, records.totalItems, currentPage]
  } catch (error) {
    throw error
  }
}

export async function createStructure(collectionName: string, name: string): Promise<void> {
  try {
    const data = { name: name }
    await pb.collection(collectionName).create(data)
  } catch (error) {
    throw error
  }
}

export async function updateStructure(
  collectionName: string,
  id: string,
  name: string
): Promise<void> {
  try {
    const data = { name }
    await pb.collection(collectionName).update(id, data)
  } catch (error) {
    throw error
  }
}

export async function deleteStructure(
  collectionName: string,
  id: string,
  filterLevel: FilterLevel
): Promise<void> {
  try {
    if ((await getLowerFilteredItems(filterLevel, id)).length === 0) {
      await pb.collection(collectionName).delete(id)
    } else {
      throw { status: 406 }
    }
  } catch (error) {
    throw error
  }
}
