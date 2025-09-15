import pb from '../utils/globalInstance'

export const login = async (email: string, password: string) => {
  try {
    const authData = await pb.collection('users').authWithPassword(email, password)

    return authData
  } catch (error) {
    throw error
  }
}
