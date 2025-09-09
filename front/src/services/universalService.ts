import PocketBase from 'pocketbase'

const pb = new PocketBase('http://127.0.0.1:8090')

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
    console.log(`Error in getIdByName for ${collectionName}:`, error)
    throw error
  }
}
