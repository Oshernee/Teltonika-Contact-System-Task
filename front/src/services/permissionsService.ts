import pb from '../utils/globalInstance'
import type { UserPermission } from '../types/user_permissions'

export const getUserPermissions = async (id: string) => {
  try {
    const permissions = await pb.collection('user_permissions').getOne<UserPermission>(id)
    return permissions || null
  } catch (error) {
    throw error
  }
}
