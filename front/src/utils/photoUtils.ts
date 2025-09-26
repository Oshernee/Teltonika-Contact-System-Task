export function getPhotoUrl(photo: File | undefined, apiBaseUrl?: string): string | undefined {
  if (!photo) return undefined

  if (typeof photo === 'string') {
    if (apiBaseUrl) {
      return `${apiBaseUrl}/${photo}`
    }
    return photo
  }

  return URL.createObjectURL(photo)
}
