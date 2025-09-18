import pb from '@/services/globalInstance'
import type { User } from '@/types/users'

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

    return { user: authData.record, token: authData.token }
  } catch (error) {
    throw error
  }
}
