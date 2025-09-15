export function validateEmail(email: string): string {
  if (!email) return 'Email is required'
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) return 'Invalid email format'
  return ''
}

export function validatePassword(password: string): string {
  if (!password) return 'Password is required'
  if (password.length < 8) return 'Must be at least 8 characters long'
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  if (!passwordRegex.test(password))
    //return 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    return ''
  return ''
}
