export function validateEmail(email: string): string {
  if (!email) return 'Paštas yra privalomas'
  if (email.length > 255) return 'Paštas negali būti ilgesnis nei 255 simboliai'
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) return 'Neteisingas pašto formato'
  return ''
}

export function validateUserName(username: string): string {
  if (!username) return ''
  if (username.length < 3) return 'Vartotojo vardas turi būti bent 3 simbolių ilgio'
  if (username.length > 50) return 'Vartotojo vardas negali būti ilgesnis nei 50 simbolių'
  const usernameRegex = /^[a-zA-Z0-9._-]+$/
  if (!usernameRegex.test(username))
    return 'Vartotojo vardas gali turėti tik raides, skaičius, taškus, brūkšnelius ir pabraukimus'
  return ''
}

export function validatePassword(password: string): string {
  if (!password) return 'Slaptažodis yra privalomas'
  if (password.length < 8) return 'Slaptažodis turi būti bent 8 simbolių ilgio'
  if (password.length > 72) return 'Slaptažodis negali būti ilgesnis nei 72 simboliai'
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
  if (name.length > 100) return 'Vardas negali būti ilgesnis nei 100 simbolių'
  const nameRegex = /^[a-zA-ZÀ-ž\s'-]+$/
  if (!nameRegex.test(name)) return 'Varde gali būti tik raidės, tarpai, apostrofai ir brūkšneliai'
  return ''
}

export function validateSurname(surname: string): string {
  if (!surname) return 'Pavardė yra privaloma'
  if (surname.length < 2) return 'Pavardė turi būti bent 2 simbolių ilgio'
  if (surname.length > 100) return 'Pavardė negali būti ilgesnė nei 100 simbolių'
  const surnameRegex = /^[a-zA-ZÀ-ž\s'-]+$/
  if (!surnameRegex.test(surname))
    return 'Pavardėje gali būti tik raidės, tarpai, apostrofai ir brūkšneliai'
  return ''
}

export function validatePhone(phone: string): string {
  if (!phone) return ''
  if (phone.length > 15) return 'Telefono numeris negali būti ilgesnis nei 15 simbolių'
  const phoneRegex = /^\+?[0-9\s\-()]{7,15}$/
  if (!phoneRegex.test(phone)) return 'Neteisingas telefono numerio formatas: +370/0 ***********'
  return ''
}

export function validatePosition(position: string): string {
  if (!position) return 'Pozicija yra privaloma'
  if (position.length < 2) return 'Pozicija turi būti bent 2 simbolių ilgio'
  if (position.length > 100) return 'Pozicija negali būti ilgesnė nei 100 simbolių'
  const positionRegex = /^[a-zA-ZÀ-ž\s'-.]+$/
  if (!positionRegex.test(position))
    return 'Pozicijoje gali būti tik raidės, tarpai, apostrofai, brūkšneliai ir taškai'
  return ''
}

export function validateStructureName(name: string): string {
  if (!name) return 'Pavadinimas yra privalomas'
  if (name.length < 2) return 'Pavadinimas turi būti bent 2 simbolių ilgio'
  if (name.length > 255) return 'Pavadinimas negali būti ilgesnis nei 255 simboliai'
  const nameRegex = /^[a-zA-ZÀ-ž0-9\s'-.]+$/
  if (!nameRegex.test(name))
    return 'Pavadinime gali būti tik raidės, skaičiai, tarpai, apostrofai, brūkšneliai ir taškai'
  return ''
}

export function validateOfficeName(name: string): string {
  if (!name) return ''
  if (name.length < 2 && name !== '') return 'Pavadinimas turi būti bent 2 simbolių ilgio'
  if (name.length > 255) return 'Pavadinimas negali būti ilgesnis nei 255 simboliai'
  const nameRegex = /^[a-zA-ZÀ-ž0-9\s'-.]+$/
  if (!nameRegex.test(name))
    return 'Pavadinime gali būti tik raidės, skaičiai, tarpai, apostrofai, brūkšneliai ir taškai'
  return ''
}

export function validateOfficeStreet(street: string): string {
  if (!street) return 'Gatvė yra privaloma'
  if (street.length < 2) return 'Gatvė turi būti bent 2 simbolių ilgio'
  if (street.length > 100) return 'Gatvė negali būti ilgesnė nei 100 simbolių'
  const streetRegex = /^[a-zA-ZÀ-ž0-9\s'-.]+$/
  if (!streetRegex.test(street))
    return 'Gatvėje gali būti tik raidės, skaičiai, tarpai, apostrofai, brūkšneliai ir taškai'
  return ''
}

export function validateOfficeStreetNumber(street_number: string): string {
  if (!street_number) return 'Namo numeris yra privalomas'
  if (street_number.length < 1) return 'Namo numeris turi būti bent 1 simbolio ilgio'
  if (street_number.length > 10) return 'Namo numeris negali būti ilgesnis nei 10 simbolių'
  const streetNumberRegex = /^[a-zA-Z0-9\s'-]+$/
  if (!streetNumberRegex.test(street_number))
    return 'Namo numeryje gali būti tik raidės, skaičiai, tarpai, apostrofai ir brūkšneliai'
  return ''
}

export function validateOfficeCity(city: string): string {
  if (!city) return 'Miestas yra privalomas'
  if (city.length < 2) return 'Miestas turi būti bent 2 simbolių ilgio'
  if (city.length > 100) return 'Miestas negali būti ilgesnis nei 100 simbolių'
  const cityRegex = /^[a-zA-ZÀ-ž\s'-.]+$/
  if (!cityRegex.test(city))
    return 'Mieste gali būti tik raidės, tarpai, apostrofai, brūkšneliai ir taškai'
  return ''
}

export function validateOfficeCountry(country: string): string {
  if (!country) return 'Šalis yra privaloma'
  if (country.length < 2) return 'Šalis turi būti bent 2 simbolių ilgio'
  if (country.length > 100) return 'Šalis negali būti ilgesnė nei 100 simbolių'
  const countryRegex = /^[a-zA-ZÀ-ž\s'-.]+$/
  if (!countryRegex.test(country))
    return 'Šalyje gali būti tik raidės, tarpai, apostrofai, brūkšneliai ir taškai'
  return ''
}
