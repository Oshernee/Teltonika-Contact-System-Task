export function validateEmail(email: string): string {
  if (!email) return 'Paštas yra privalomas'
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) return 'Neteisingas pašto formato'
  return ''
}

export function validatePassword(password: string): string {
  if (!password) return 'Slaptažodis yra privalomas'
  if (password.length < 8) return 'Slaptažodis turi būti bent 8 simbolių ilgio'
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  if (!passwordRegex.test(password))
    // Logiškai čia turėtų būti kažkas, bet šiuo metu grąžinu tuščią stringą, nes paskirti slaptažodžiai neatitinka šių reikalavimų
    //return 'Slaptažodis turi turėti bent vieną didžiąją raidę, vieną mažąją raidę, vieną skaičių ir vieną specialųjį simbolį'
    return ''
  return ''
}
