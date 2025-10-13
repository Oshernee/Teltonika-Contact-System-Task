<template>
  <div class="w-[900px] h-[600px] p-6 space-y-6 flex flex-row gap-8 items-start relative">
    <div>
      <div>
        <h2 class="text-3xl pb-8">Pridėti naują admin paskyrą:</h2>
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
    </div>
    <div>
      <div class="space-y-4 text-lg pt-10">
        <text class="text-md font-medium"> Administracinės teisės: </text>
      </div>
      <div class="flex flex-col items-start gap-4">
        <Checkbox
          label="Redaguoti ir kurti kontaktus"
          :modelValue="permissions.edit_employees"
          @update:modelValue="(val) => (permissions.edit_employees = val)"
        />
        <Checkbox
          label="Trinti kontaktus"
          :modelValue="permissions.delete_employees"
          @update:modelValue="(val) => (permissions.delete_employees = val)"
        />
        <Checkbox
          label="Redaguoti ir kurti įmones"
          :modelValue="permissions.edit_companies"
          @update:modelValue="(val) => (permissions.edit_companies = val)"
        />
        <Checkbox
          label="Trinti įmones"
          :modelValue="permissions.delete_companies"
          @update:modelValue="(val) => (permissions.delete_companies = val)"
        />
        <Checkbox
          label="Redaguoti ir kurti ofisus"
          :modelValue="permissions.edit_offices"
          @update:modelValue="(val) => (permissions.edit_offices = val)"
        />
        <Checkbox
          label="Trinti ofisus"
          :modelValue="permissions.delete_offices"
          @update:modelValue="(val) => (permissions.delete_offices = val)"
        />
        <Checkbox label="Redaguoti ir kurti struktūras" v-model="permissions.edit_structure" />
        <Checkbox label="Trinti struktūrą" v-model="permissions.delete_structure" />
      </div>
    </div>
    <div class="absolute bottom-4 right-4">
      <button
        :disabled="sending"
        @click="handleUpdate"
        class="w-32 bg-secondary text-white py-2 px-4 rounded-md font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
      >
        PRIDĖTI
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { addUser } from '@/services/userService'
import { useNotificationStore } from '@/stores/Notification'
import { validateEmail, validateUserName } from '@/utils/validateInputs'
import { handleImageUpload } from '@/utils/photoUtils'
import { useUserStore } from '@/stores/Auth'
import Checkbox from '@/components/ui/Checkbox.vue'
import Email from '@/assets/Email.svg'

import { ref, reactive } from 'vue'

const emit = defineEmits(['update', 'close', 'updateCurrent', 'delete'])

const notificationStore = useNotificationStore()
const userStore = useUserStore()

const image = ref<File | null>(null)
const sending = ref(false)
const valuesChanged = ref(false)

let name = ref()
let email = ref()

const errorMessages = reactive<Record<string, string>>({
  name: '',
  email: '',
  image: '',
})

const permissions = ref({
  edit_employees: false,
  delete_employees: false,
  edit_offices: false,
  delete_offices: false,
  edit_structure: false,
  delete_structure: false,
  edit_companies: false,
  delete_companies: false,
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

  try {
    await userStore.refreshUser()
    if (userStore.user?.name !== 'Admin') {
      notificationStore.addErrorNotification('Jūs neturite teisių pridėti paskyros', '')
      emit('close')
      sending.value = false
      return
    }

    const password = await addUser(
      {
        name: trimmedName,
        email: trimmedEmail,
        avatar: image.value,
      },
      permissions.value,
    )

    notificationStore.addSuccessNotification('Paskyra sėkmingai pridėta')
    emit('update')
    emit('updateCurrent', password)
  } catch (error) {
    notificationStore.addErrorNotification('Įvyko klaida pridedant paskyrą', error)
  } finally {
    sending.value = false
  }
}
</script>
