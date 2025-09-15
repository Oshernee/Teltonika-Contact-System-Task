import pb from '../utils/globalInstance'

export const getUserPermissions = async (id: string) => {
  try {
    const permissions = await pb.collection('user_permissions').getOne(id)
    return permissions || null
  } catch (error) {
    throw error
  }
}
