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

export function validateName(name: string): string {
  if (!name) return 'Vardas yra privalomas'
  if (name.length < 2) return 'Vardas turi būti bent 2 simbolių ilgio'
  const nameRegex = /^[a-zA-ZÀ-ž\s'-]+$/
  if (!nameRegex.test(name)) return 'Varde gali būti tik raidės, tarpai, apostrofai ir brūkšneliai'
  return ''
}

export function validateSurname(surname: string): string {
  if (!surname) return 'Pavardė yra privaloma'
  if (surname.length < 2) return 'Pavardė turi būti bent 2 simbolių ilgio'
  const surnameRegex = /^[a-zA-ZÀ-ž\s'-]+$/
  if (!surnameRegex.test(surname))
    return 'Pavardėje gali būti tik raidės, tarpai, apostrofai ir brūkšneliai'
  return ''
}

export function validatePhone(phone: string): string {
  if (!phone) return ''
  const phoneRegex = /^\+?[0-9\s\-()]{7,15}$/
  if (!phoneRegex.test(phone)) return 'Neteisingas telefono numerio formatas'
  return ''
}

export function validatePosition(position: string): string {
  if (!position) return 'Pozicija yra privaloma'
  if (position.length < 2) return 'Pozicija turi būti bent 2 simbolių ilgio'
  const positionRegex = /^[a-zA-ZÀ-ž\s'-]+$/
  if (!positionRegex.test(position))
    return 'Pozicijoje gali būti tik raidės, tarpai, apostrofai ir brūkšneliai'
  return ''
}
