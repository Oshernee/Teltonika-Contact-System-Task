import pb from '@/services/globalInstance'

export const ChangePassword = async (newPassword: string, token: string) => {
  try {
    const response = await pb
      .collection('users')
      .confirmPasswordReset(token, newPassword, newPassword)
    return response
  } catch (error) {
    console.log('Error changing password:', error)
    throw error
  }
}
