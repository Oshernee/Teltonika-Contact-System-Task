<template>
  <div class="min-h-screen min-w-full bg-secondary flex flex-col">
    <ReturnButton side="left" />
    <div class="flex min-h-screen min-w-full justify-center items-center pt-10">
      <form class="bg-white p-8 rounded shadow-md w-[500px] flex flex-col items-center">
        <h1 class="text-4xl mb-24 text-gray-800 font-medium">Slaptažodžio atkūrimas:</h1>

        <div class="mb-24 w-full max-w-[400px]">
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
          <div class="text-red-500 text-sm mt-1 absolute" v-if="emailError">
            {{ emailError }}
          </div>
        </div>

        <button
          class="w-full max-w-[400px] bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          type="button"
          @click="RecoverPassword(email)"
        >
          SIŲSTI
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import ReturnButton from '../components/ReturnButton.vue'

import Email from '../assets/Email.svg'
import { validateEmail } from '../utils/validateInputs'

const email = ref('')

const emailError = ref('')

const RecoverPassword = (email: string) => {
  emailError.value = validateEmail(email)
  if (emailError.value) {
    return
  }

  // Password recovery logic here
}
</script>
