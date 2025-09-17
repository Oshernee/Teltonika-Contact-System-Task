<template>
  <div class="min-h-screen min-w-full bg-secondary flex flex-col">
    <div class="flex min-h-screen min-w-full justify-center items-center pt-10">
      <form
        class="bg-white p-8 rounded shadow-md w-[500px] flex flex-col items-center"
        @submit.prevent="submitPasswordChange(password[0], token)"
      >
        <h1 class="text-4xl mb-12 text-gray-800 font-medium">Slaptažodžio keitimas:</h1>
        <div class="mb-8 w-full max-w-[400px] space-y-6">
          <div>
            <label class="block text-gray-600 text-sm mb-2"> Slaptažodis: </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                <img :src="Password" class="w-6 h-6 text-gray-400" alt="Password" />
              </div>
              <input
                class="w-full pl-10 pr-10 py-3 bg-gray-100 border-0 rounded text-gray-700 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
                :type="passwordVisible[0] ? 'text' : 'password'"
                id="password-0"
                placeholder="Įveskite slaptažodį..."
                v-model="password[0]"
              />
              <div
                class="absolute inset-y-0 right-0 pr-2 flex items-center cursor-pointer"
                @click="switchPasswordVisibility(0)"
              >
                <img
                  v-if="!passwordVisible[0]"
                  :src="SeePassword"
                  class="w-6 h-6 text-gray-400"
                  alt="Show password"
                />
                <img v-else :src="HidePassword" class="w-6 h-6 text-gray-400" alt="Hide password" />
              </div>
            </div>
            <p v-if="passwordError[0]" class="text-red-500 text-sm mt-2">{{ passwordError[0] }}</p>
          </div>

          <div>
            <label class="block text-gray-600 text-sm mb-2"> Slaptažodžio pakartojimas: </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                <img :src="Password" class="w-6 h-6 text-gray-400" alt="Password" />
              </div>
              <input
                class="w-full pl-10 pr-10 py-3 bg-gray-100 border-0 rounded text-gray-700 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
                :type="passwordVisible[1] ? 'text' : 'password'"
                id="password-1"
                placeholder="Pakartokite slaptažodį..."
                v-model="password[1]"
              />
              <div
                class="absolute inset-y-0 right-0 pr-2 flex items-center cursor-pointer"
                @click="switchPasswordVisibility(1)"
              >
                <img
                  v-if="!passwordVisible[1]"
                  :src="SeePassword"
                  class="w-6 h-6 text-gray-400"
                  alt="Show password"
                />
                <img v-else :src="HidePassword" class="w-6 h-6 text-gray-400" alt="Hide password" />
              </div>
            </div>
            <p v-if="passwordError[1]" class="text-red-500 text-sm mt-2">{{ passwordError[1] }}</p>
          </div>
        </div>

        <button
          class="w-full max-w-[400px] bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          type="submit"
        >
          SIŲSTI
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import { ChangePassword } from '../services/passwordService'

import SeePassword from '../assets/SeePassword.svg'
import HidePassword from '../assets/HidePassword.svg'
import Password from '../assets/Password.svg'

import { validatePassword } from '../utils/validateInputs'

import { useNotificationStore } from '../stores/Notification'
import { useRoute, useRouter } from 'vue-router'

const password = ref(['', ''])
const passwordError = ref(['', ''])

const passwordVisible = ref([false, false])

const notificationStore = useNotificationStore()

const route = useRoute()
const router = useRouter()
const token = route.params.token as string

const submitPasswordChange = async (newPassword: string, token: string) => {
  if (password.value[0] !== password.value[1]) {
    passwordError.value[1] = 'Slaptažodžiai nesutampa'
    return
  }

  passwordError.value[0] = validatePassword(newPassword)
  if (passwordError.value[0]) {
    return
  }

  try {
    await ChangePassword(newPassword, token)
    notificationStore.addSuccessNotification('Slaptažodis sėkmingai pakeistas!')
    router.push('/login')
  } catch (error) {
    notificationStore.addErrorNotification('Nepavyko pakeisti slaptažodžio.', error)
  }
}

const switchPasswordVisibility = (index: number) => {
  passwordVisible.value[index] = !passwordVisible.value[index]
}
</script>
