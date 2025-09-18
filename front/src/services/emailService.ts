import pb from '@/services/globalInstance'

export const requestPasswordReset = async (email: string) => {
  try {
    await pb.collection('users').requestPasswordReset(email)
  } catch (error) {
    throw error
  }
}
