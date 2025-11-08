import { ref, type Ref } from 'vue'

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

export function handleImageUpload(event: Event): {
  image: Ref<File | null>
  errorMessage: Ref<string>
} {
  const target = event.target as HTMLInputElement
  const errorMessage = ref('')
  const image = ref<File | null>(null)
  errorMessage.value = ''

  if (target.files && target.files[0]) {
    const file = target.files[0]
    const maxSizeKB = 5 * 1024
    const fileSizeKB = file.size / 1024

    if (fileSizeKB > maxSizeKB) {
      errorMessage.value = `Nuotrauka per didelė. Maksimalus dydis: ${maxSizeKB}KB (dabartinis: ${fileSizeKB.toFixed(
        1
      )}KB)`
      image.value = null
      target.value = ''
      return { image, errorMessage }
    }

    if (!file.type.startsWith('image/')) {
      errorMessage.value = 'Galima įkelti tik nuotraukas (JPG, PNG, GIF, etc.)'
      image.value = null
      target.value = ''
      return { image, errorMessage }
    }

    image.value = file
    return { image, errorMessage }
  } else {
    image.value = null
    return { image, errorMessage }
  }
}
