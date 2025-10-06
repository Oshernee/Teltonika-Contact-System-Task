import pb from '@/services/globalInstance'
import { getConnectionById } from '@/services/universalService'

export async function createOffice(
  collectionName: string,
  street: string,
  street_number: string,
  city: string,
  country: string,
  name?: string,
  upperStructureId?: string[],
  upperRelationField?: string
): Promise<void> {
  try {
    const data = {
      name: name,
      street: street,
      street_number: street_number,
      city: city,
      country: country,
    }
    const response = await pb.collection(collectionName).create(data)
    if (upperStructureId && upperRelationField) {
      for (const id of upperStructureId) {
        await pb.collection(upperRelationField + '_' + collectionName).create({
          [upperRelationField.slice(0, -3) + 'y_id']: id,
          [collectionName.slice(0, -1) + '_id']: response.id,
        })
      }
    }
  } catch (error) {
    throw error
  }
}

export async function updateOffice(
  collectionName: string,
  id: string,
  data: Partial<{
    name: string
    street: string
    street_number: string
    city: string
    country: string
  }>,
  upperStructureId?: string[],
  upperStructureType?: string
): Promise<void> {
  try {
    await pb.collection(collectionName).update(id, data)
    if (upperStructureId && upperStructureType) {
      const existingConnections = await getConnectionById(id, collectionName, upperStructureType)

      const upperFieldName = upperStructureType.slice(0, -3) + 'y_id'
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
