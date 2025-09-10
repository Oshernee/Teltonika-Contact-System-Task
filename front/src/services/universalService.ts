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
    throw error
  }
}

export async function getLowerFilteredItems(
  linkCollection: string,
  targetCollection: string,
  linkField: string,
  targetField: string,
  id: string
): Promise<any[]> {
  try {
    const links = await pb
      .collection(linkCollection)
      .getFullList(200, { filter: `${linkField}="${id}"`, sort: '-created' })
    const targetData = await pb.collection(targetCollection).getFullList(200, { sort: '-created' })
    const filteredItems = targetData.filter((item) =>
      links.some((link) => link[targetField] === item.id)
    )
    return filteredItems
  } catch (error) {
    throw error
  }
}
