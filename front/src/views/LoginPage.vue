<template>
  <div class="min-h-screen min-w-full bg-secondary flex flex-col">
    <ReturnButton side="left" />
    <div class="flex min-h-screen min-w-full justify-center items-center pt-10">
      <form
        class="bg-white p-8 rounded shadow-md w-[500px] flex flex-col items-center"
        @submit.prevent="Login(email, password)"
      >
        <h1 class="text-4xl mb-8 text-gray-800 font-medium">Admin prisijungimas:</h1>

        <div class="mb-10 w-full max-w-[400px]">
          <label class="block text-gray-600 text-sm mb-2"> Elektroninis paštas: </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
              <img :src="Email" class="w-6 h-6 text-gray-400" alt="Email" />
            </div>
            <input
              class="w-full pl-10 pr-3 py-3 bg-gray-100 border-0 rounded text-gray-700 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
              type="email"
              placeholder="Įveskite el. pašto adresą..."
              v-model="email"
            />
          </div>
          <div class="text-red-500 text-sm mt-1 absolute w-[400px]" v-if="emailError">
            {{ emailError }}
          </div>
        </div>

        <div class="mb-12 w-full max-w-[400px]">
          <label class="block text-gray-600 text-sm mb-2"> Slaptažodis: </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
              <img :src="Password" class="w-6 h-6 text-gray-400" alt="Password" />
            </div>
            <input
              class="w-full pl-10 pr-10 py-3 bg-gray-100 border-0 rounded text-gray-700 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
              :type="showPassword ? 'text' : 'password'"
              id="password"
              placeholder="Įveskite slaptažodį..."
              v-model="password"
            />
            <div
              class="absolute inset-y-0 right-0 pr-2 flex items-center cursor-pointer"
              @click="showPassword = !showPassword"
            >
              <img
                v-if="!showPassword"
                :src="SeePassword"
                class="w-6 h-6 text-gray-400"
                alt="Show password"
              />
              <img v-else :src="HidePassword" class="w-6 h-6 text-gray-400" alt="Hide password" />
            </div>
          </div>
          <div class="text-red-500 text-sm mt-1 absolute w-[400px]" v-if="passwordError">
            {{ passwordError }}
          </div>
        </div>

        <div class="mb-8 w-full max-w-[400px] text-left">
          <a class="text-sm text-blue-600 hover:text-blue-800" href="/password-recovery">
            Slaptažodžio atkūrimas
          </a>
        </div>

        <button
          class="w-full max-w-[400px] bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          type="submit"
        >
          PRISIJUNGTI
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { validateEmail, validatePassword } from '@/utils/validateInputs'

import { login } from '@/services/userServices'
import { getUserPermissions } from '@/services/permissionsService'

import ReturnButton from '@/components/ui/ReturnButton.vue'

import { useNotificationStore } from '@/stores/Notification'
import { useUserStore } from '@/stores/Auth'

import Email from '@/assets/Email.svg'
import Password from '@/assets/Password.svg'
import SeePassword from '@/assets/SeePassword.svg'
import HidePassword from '@/assets/HidePassword.svg'

import { subscribeToPermissionChanges } from '@/services/pocketbaseSubscriptionService'

const email = ref('')
const password = ref('')

const emailError = ref('')
const passwordError = ref('')
const showPassword = ref(false)

const notificationStore = useNotificationStore()
const userStore = useUserStore()
const router = useRouter()

const Login = async (email: string, password: string) => {
  try {
    emailError.value = validateEmail(email)
    passwordError.value = validatePassword(password)

    if (emailError.value || passwordError.value) {
      return
    }

    const { user, token } = await login(email, password)
    const permissions = await getUserPermissions(user.permissions_id)
    userStore.setUser(user, token)
    userStore.savePermissions(permissions)
    subscribeToPermissionChanges(user.permissions_id)
    notificationStore.addSuccessNotification('Sėkmingai prisijungta')
    router.push('/')
  } catch (error) {
    notificationStore.addErrorNotification('Prisijungti nepavyko, bandykite dar kartą', error)
    password = ''
    return null
  }
}
</script>
