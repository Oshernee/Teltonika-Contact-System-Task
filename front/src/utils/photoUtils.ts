export function getPhotoUrl(
  photo: string | File | undefined,
  apiBaseUrl?: string
): string | undefined {
  if (!photo) return undefined

  if (typeof photo === 'string') {
    if (photo.startsWith('http://') || photo.startsWith('https://')) {
      return photo
    }
    if (apiBaseUrl) {
      return `${apiBaseUrl}/${photo}`
    }
    return photo
  }

  return URL.createObjectURL(photo)
}
