<template>
  <div class="min-h-screen min-w-full bg-secondary flex flex-col">
    <ReturnButton side="left" />
    <div class="flex min-h-screen min-w-full justify-center items-center pt-10">
      <form class="bg-white p-8 rounded shadow-md w-[500px] flex flex-col items-center">
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
              type="password"
              id="password"
              placeholder="Įveskite slaptažodį..."
              v-model="password"
            />
            <div
              class="absolute inset-y-0 right-0 pr-2 flex items-center cursor-pointer"
              @click="switchPasswordVisibility"
            >
              <img
                v-if="!passwordVisible"
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
          type="button"
          @click="Login(email, password)"
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

import { validateEmail, validatePassword } from '../utils/validateInputs'

import { login } from '../services/userServices'
import { getUserPermissions } from '../services/permissionsService'

import ReturnButton from '../components/ReturnButton.vue'

import { useNotificationStore } from '../stores/Notification'
import { useUserStore } from '../stores/Auth'

import Email from '../assets/Email.svg'
import Password from '../assets/Password.svg'
import SeePassword from '../assets/SeePassword.svg'
import HidePassword from '../assets/HidePassword.svg'

import { subscribeToPermissionChanges } from '../services/pocketbaseSubscriptionService'

const email = ref('')
const password = ref('')

const emailError = ref('')
const passwordError = ref('')

const passwordVisible = ref(false)

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

    const user = await login(email, password)
    const permissions = await getUserPermissions(user.record.permissions_id)
    userStore.setUser(
      {
        id: user.record.id,
        email: user.record.email,
        permissions_id: user.record.permissions_id,
        username: user.record.username,
        name: user.record.name,
        created_at: user.record.created_at,
        updated_at: user.record.updated_at,
      },
      user.token
    )
    userStore.savePermissions({
      id: permissions.id,
      edit_employees: permissions.edit_employees,
      delete_employees: permissions.delete_employees,
      edit_offices: permissions.edit_offices,
      delete_offices: permissions.delete_offices,
      edit_structure: permissions.edit_structure,
      delete_structure: permissions.delete_structure,
      read_permissions: permissions.read_permissions,
      edit_permissions: permissions.edit_permissions,
      delete_permissions: permissions.delete_permissions,
      edit_companies: permissions.edit_companies,
      delete_companies: permissions.delete_companies,
      updated_at: permissions.updated_at,
      created_at: permissions.created_at,
    })
    subscribeToPermissionChanges(user.record.permissions_id)
    notificationStore.addSuccessNotification('Sėkmingai prisijungta')
    router.push('/')
  } catch (error) {
    console.log(error)
    notificationStore.addErrorNotification('Prisijungti nepavyko, bandykite dar kartą', error)
    password = ''
    return null
  }
}

const switchPasswordVisibility = () => {
  const passwordInput = document.getElementById('password') as HTMLInputElement
  if (passwordInput.type === 'password') {
    passwordInput.type = 'text'
    passwordVisible.value = true
  } else {
    passwordInput.type = 'password'
    passwordVisible.value = false
  }
}
</script>
