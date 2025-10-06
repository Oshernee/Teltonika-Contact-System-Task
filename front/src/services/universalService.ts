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
    if (!filterLevel.linkCollection) return []
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

    return [records.items, records.totalItems, currentPage]
  } catch (error) {
    throw error
  }
}

export async function createStructure(
  collectionName: string,
  name: string,
  upperStructureId?: string[],
  upperRelationField?: string
): Promise<void> {
  try {
    const data = { name: name }
    const response = await pb.collection(collectionName).create(data)
    if (upperStructureId && upperRelationField) {
      for (const id of upperStructureId) {
        await pb.collection(upperRelationField + '_' + collectionName).create({
          [upperRelationField.slice(0, -1) + '_id']: id,
          [collectionName.slice(0, -1) + '_id']: response.id,
        })
      }
    }
  } catch (error) {
    throw error
  }
}

export async function getConnectionById(
  id: string,
  structureType: string,
  upperStructureType: string
): Promise<Record<string, any>[]> {
  try {
    const data = await pb.collection(upperStructureType + '_' + structureType).getFullList(200, {
      filter: `${structureType.slice(0, -1)}_id="${id}"`,
    })
    return data
  } catch (error) {
    throw error
  }
}

export async function updateStructure(
  collectionName: string,
  id: string,
  name: string,
  upperStructureId?: string[],
  upperStructureType?: string
): Promise<void> {
  try {
    const data = { name }
    await pb.collection(collectionName).update(id, data)
    if (upperStructureId && upperStructureType) {
      const existingConnections = await getConnectionById(id, collectionName, upperStructureType)

      const upperFieldName = upperStructureType.slice(0, -1) + '_id'
      const currentFieldName = collectionName.slice(0, -1) + '_id'
      const junctionCollection = upperStructureType + '_' + collectionName

      const existingUpperIds = existingConnections.map((conn) => conn[upperFieldName])

      const idsToAdd = upperStructureId.filter((uid) => !existingUpperIds.includes(uid))
      const idsToRemove = existingUpperIds.filter((eid) => !upperStructureId.includes(eid))

      for (const uid of idsToAdd) {
        await pb.collection(junctionCollection).create({
          [upperFieldName]: uid,
          [currentFieldName]: id,
        })
      }

      for (const eid of idsToRemove) {
        const connection = existingConnections.find((conn) => conn[upperFieldName] === eid)
        if (connection) {
          await pb.collection(junctionCollection).delete(connection.id)
        }
      }
    }
  } catch (error) {
    throw error
  }
}

export async function deleteStructure(
  collectionName: string,
  id: string,
  filterLevel: FilterLevel,
  upperCollectionName: string
): Promise<void> {
  try {
    if ((await getLowerFilteredItems(filterLevel, id)).length === 0) {
      await pb.collection(collectionName).delete(id)
      await deleteConnection(collectionName, upperCollectionName, id)
    } else {
      throw { status: 406 }
    }
  } catch (error) {
    throw error
  }
}

export async function deleteConnection(
  collectionName: string,
  upperCollectionName: string,
  id: string
): Promise<void> {
  try {
    const connections = await getConnectionById(id, collectionName, upperCollectionName)
    for (const conn of connections) {
      await pb.collection(upperCollectionName + '_' + collectionName).delete(conn.id)
    }
  } catch (error) {
    throw error
  }
}

export async function isStructureNameUnique(name: string, structureType: string): Promise<boolean> {
  try {
    const records = await pb
      .collection(structureType)
      .getFullList<{ name: string }>(200, { filter: `name="${name}"` })
    return records.length === 0
  } catch (error) {
    throw error
  }
}
