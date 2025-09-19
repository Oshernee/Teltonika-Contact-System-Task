import pb from '@/services/globalInstance'
import type { User } from '@/types/users'
import type { UserPermission } from '@/types/user_permissions'

export const login = async (email: string, password: string) => {
  try {
    const authData = await pb.collection('users').authWithPassword<User>(email, password)

    return { user: authData.record, token: authData.token }
  } catch (error) {
    throw error
  }
}

export const refreshUserInformation = async () => {
  try {
    const authData = await pb.collection('users').authRefresh<User>()
    const permissions = await getUserPermissions(authData.record.permissions_id)

    return { user: authData.record, token: authData.token, permissions }
  } catch (error) {
    throw error
  }
}

export const getUserPermissions = async (id: string) => {
  try {
    const permissions = await pb.collection('user_permissions').getOne<UserPermission>(id)
    return permissions || null
  } catch (error) {
    throw error
  }
}

export const requestPasswordReset = async (email: string) => {
  try {
    await pb.collection('users').requestPasswordReset(email)
  } catch (error) {
    throw error
  }
}

export const ChangePassword = async (newPassword: string, token: string) => {
  try {
    const response = await pb
      .collection('users')
      .confirmPasswordReset(token, newPassword, newPassword)
    return response
  } catch (error) {
    throw error
  }
}
