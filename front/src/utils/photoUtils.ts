export function getPhotoUrl(photo: string | File | undefined): string | undefined {
  if (!photo) return undefined
  if (typeof photo === 'string') return photo
  return URL.createObjectURL(photo)
}
