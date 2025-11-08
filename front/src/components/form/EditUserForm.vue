<template>
  <div class="w-[450px] h-[600px] p-6 space-y-6 flex flex-col items-start relative">
    <div>
      <h2 class="text-3xl">Redaguoti paskyrą:</h2>
    </div>
    <div class="w-full space-y-4">
      <div class="flex flex-col space-y-1">
        <label for="name" class="font-medium">Vardas:</label>
        <input
          placeholder="Įveskite vardą"
          v-model="name"
          type="text"
          id="name"
          class="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div class="text-red-500 text-sm" v-if="errorMessages.name">
          {{ errorMessages.name }}
        </div>
      </div>
      <div class="space-y-1">
        <label for="email" class="font-medium">Elektroninis paštas:</label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <img :src="Email" class="w-5 h-5 text-gray-400" alt="Email" />
          </div>
          <input
            placeholder="Įveskite elektroninį paštą"
            v-model="email"
            type="email"
            id="email"
            class="w-full border border-gray-300 rounded-md p-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div class="text-red-500 text-sm" v-if="errorMessages.email">
          {{ errorMessages.email }}
        </div>
      </div>
      <label
        for="image-upload"
        class="w-[40%] bg-secondary text-white py-3 px-4 rounded-md font-medium hover:bg-blue-600 transition-colors mb-2 cursor-pointer flex items-center justify-center gap-2"
      >
        Įkelti nuotrauką
      </label>
      <input
        type="file"
        @change="uploadImage($event)"
        accept="image/*"
        class="hidden"
        id="image-upload"
      />
      <p class="text-sm text-gray-500 text-start mt-2">
        {{
          image
            ? `${image.name} (${(image.size / 1024).toFixed(1)} KB)`
            : 'Nuotrauka neįkelta. Maks. 5MB'
        }}
        <button v-if="image" @click="image = null" class="text-red-500 text-sm ml-2">x</button>
      </p>
      <div class="text-red-500 text-sm" v-if="errorMessages.image">
        {{ errorMessages.image }}
      </div>
    </div>
    <div class="absolute bottom-4 right-4">
      <button
        :disabled="sending"
        @click="handleUpdate"
        class="w-32 bg-secondary text-white py-2 px-4 rounded-md font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
      >
        ATNAUJINTI
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { User } from '@/types/users'
import { updateUser, isEmailTaken } from '@/services/userService'
import { useNotificationStore } from '@/stores/Notification'
import { validateEmail, validateUserName } from '@/utils/validateInputs'
import { handleImageUpload } from '@/utils/photoUtils'
import { useUserStore } from '@/stores/Auth'
import Email from '@/assets/Email.svg'
import { useRouter } from 'vue-router'

import { ref, reactive } from 'vue'

const emit = defineEmits(['update', 'close', 'updateCurrent', 'delete'])

const notificationStore = useNotificationStore()
const userStore = useUserStore()
const router = useRouter()

const props = defineProps<{
  user: User
}>()

const image = ref<File | null>(null)
const sending = ref(false)
const valuesChanged = ref(false)

let name = ref(props.user.name)
let email = ref(props.user.email)

const errorMessages = reactive<Record<string, string>>({
  name: '',
  email: '',
  image: '',
})

function trimWhiteSpace(str: string): string {
  return str.trim().replace(/\s+/g, ' ')
}

const validateFields = () => {
  const trimmedName = trimWhiteSpace(name.value || '')
  const trimmedEmail = trimWhiteSpace(email.value)

  errorMessages.name = validateUserName(trimmedName)
  errorMessages.email = validateEmail(trimmedEmail)

  if (errorMessages.name || errorMessages.email) {
    return false
  }
  return true
}

const uploadImage = (event: Event) => {
  const { image: uploadedImage, errorMessage } = handleImageUpload(event)
  image.value = uploadedImage.value
  errorMessages.image = errorMessage.value
  valuesChanged.value = true
}

const handleUpdate = async () => {
  if (sending.value) return
  sending.value = true

  if (!validateFields()) {
    sending.value = false
    return
  }

  const trimmedName = trimWhiteSpace(name.value || '')
  const trimmedEmail = trimWhiteSpace(email.value || '')

  if (
    trimmedName === props.user.name &&
    trimmedEmail === props.user.email &&
    !valuesChanged.value
  ) {
    notificationStore.addInfoNotification('Nėra padarytų pakeitimų')
    sending.value = false
    return
  }

  try {
    const emailStatus = await isEmailTaken(trimWhiteSpace(email.value))
    if (emailStatus) {
      errorMessages.email = 'Šis el. paštas jau yra užregistruotas'
      sending.value = false
      return
    }

    await userStore.refreshUser()
    if (userStore.permissions?.edit_permissions !== true) {
      notificationStore.addErrorNotification('Jūs neturite teisių redaguoti paskyrą', '')
      router.push('/')
      emit('close')
      sending.value = false
      return
    }

    await updateUser(props.user.id, {
      name: trimmedName,
      email: trimmedEmail,
      avatar: image.value,
    })

    notificationStore.addSuccessNotification('Paskyra sėkmingai atnaujinta')
    emit('update')
    emit('close')
  } catch (error) {
    if (error.status === 400) {
      errorMessages.email = 'Šis el. paštas jau yra užregistruotas'
      notificationStore.addErrorNotification('Neteisingi duomenys', error)
    } else {
      notificationStore.addErrorNotification('Įvyko klaida redaguojant paskyrą', error)
    }
  } finally {
    sending.value = false
  }
}
</script>
