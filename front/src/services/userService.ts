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

export const ChangeNewPassword = async (newPassword: string) => {
  try {
    const response = await pb.collection('users').update<User>(pb.authStore.model?.id || '', {
      password: newPassword,
      passwordConfirm: newPassword,
      first_login: false,
    })
    return response
  } catch (error) {
    throw error
  }
}

export const isEmailTaken = async (email: string): Promise<boolean> => {
  try {
    console.log('Checking email:', email) // Debugging line
    const records = await pb.collection('users').getList<User>(1, 1, { filter: `email="${email}"` })
    console.log('Records found:', records.totalItems) // Debugging line
    return records.totalItems > 0
  } catch (error) {
    throw error
  }
}

export const getUsers = async (currentPage: number, itemsPerPage: number): Promise<any> => {
  try {
    const records = await pb
      .collection('users')
      .getList<User>(currentPage, itemsPerPage, { sort: '-created' })

    if (currentPage > records.totalPages && records.totalPages > 0) {
      currentPage = records.totalPages
      return getUsers(currentPage, itemsPerPage)
    }

    return [records.items, records.totalItems, currentPage]
  } catch (error) {
    throw error
  }
}

export const addUser = async (userData: Partial<User>, permissionData: Partial<UserPermission>) => {
  try {
    const newPermissions = await pb.collection('user_permissions').create<UserPermission>({
      edit_employees: permissionData.edit_employees || false,
      delete_employees: permissionData.delete_employees || false,
      edit_companies: permissionData.edit_companies || false,
      delete_companies: permissionData.delete_companies || false,
      edit_offices: permissionData.edit_offices || false,
      delete_offices: permissionData.delete_offices || false,
      edit_structure: permissionData.edit_structure || false,
      delete_structure: permissionData.delete_structure || false,
      read_permissions: true,
      edit_permissions: false,
      delete_permissions: false,
    })

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let password = ''
    for (let i = 0; i < 16; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }

    await pb.collection('users').create({
      ...userData,
      password: password,
      passwordConfirm: password,
      permissions_id: newPermissions.id,
      first_login: true,
    })

    await pb.collection('users').requestVerification(userData.email || '', {
      name: userData.name,
      email: userData.email,
      password: password,
    })

    return password
  } catch (error) {
    throw error
  }
}

export const updateUser = async (id: string, userData: Partial<User>) => {
  try {
    const updatedUser = await pb.collection('users').update<User>(id, userData)
    return updatedUser
  } catch (error) {
    throw error
  }
}

export const updateUserPermissions = async (id: string, permissions: Partial<UserPermission>) => {
  try {
    const updatedPermissions = await pb
      .collection('user_permissions')
      .update<UserPermission>(id, permissions)
    return updatedPermissions
  } catch (error) {
    throw error
  }
}

export const deleteUser = async (id: string, permissions_id: string) => {
  try {
    await pb.collection('users').delete(id)
    await pb.collection('user_permissions').delete(permissions_id)
  } catch (error) {
    throw error
  }
}
