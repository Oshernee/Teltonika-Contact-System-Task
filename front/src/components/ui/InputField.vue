<template>
  <div @input="debouncedEmit([name, surname, position, email, phone])">
    <div class="mt-4">
      <label class="block mt-4 text-lg font-medium text-gray-500"
        >Vardas<span class="text-red-600 ml-1">*</span></label
      >
      <input
        v-model="name"
        type="text"
        placeholder="Įveskite vardą..."
        class="mt-1 block w-full px-4 py-3 bg-gray-200 rounded-md placeholder-gray-800 font-extralight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
      />
    </div>
    <div class="text-red-500 text-sm mt-1 absolute w-full" v-if="props.errorMessages.name">
      {{ props.errorMessages.name }}
    </div>
    <div class="mt-6">
      <label class="block mt-4 text-lg font-medium text-gray-500"
        >Pavardė<span class="text-red-600 ml-1">*</span></label
      >
      <input
        v-model="surname"
        type="text"
        placeholder="Įveskite pavardę..."
        class="mt-1 block w-full px-4 py-3 bg-gray-200 rounded-md placeholder-gray-800 font-extralight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
      />
    </div>
    <div class="text-red-500 text-sm mt-1 absolute w-full" v-if="props.errorMessages.surname">
      {{ props.errorMessages.surname }}
    </div>
    <div class="mt-6">
      <label class="block mt-4 text-lg font-medium text-gray-500"
        >Pozicija<span class="text-red-600 ml-1">*</span></label
      >
      <input
        v-model="position"
        type="text"
        placeholder="Įveskite poziciją..."
        class="mt-1 block w-full px-4 py-3 bg-gray-200 rounded-md placeholder-gray-800 font-extralight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
      />
    </div>
    <div class="text-red-500 text-sm mt-1 absolute w-full" v-if="props.errorMessages.position">
      {{ props.errorMessages.position }}
    </div>
    <h1 class="text-2xl pl-6 pt-8">Kontaktinė informacija:</h1>
    <div class="mt-6">
      <label class="block mt-4 text-lg font-medium text-gray-500"
        >El. paštas<span class="text-red-600 ml-1">*</span></label
      >
      <div class="relative">
        <div class="absolute inset-y-0 start-0 flex items-center ps-2 pointer-events-none">
          <img :src="Email" class="w-6 h-6 text-gray-400" alt="Email" />
        </div>
        <input
          v-model="email"
          type="email"
          placeholder="Įveskite el. paštą..."
          class="mt-1 mr-4 block w-full px-4 py-3 bg-gray-200 rounded-md placeholder-gray-800 font-extralight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent ps-10 p-2.5"
        />
      </div>
    </div>
    <div class="text-red-500 text-sm mt-1 absolute w-full" v-if="props.errorMessages.email">
      {{ props.errorMessages.email }}
    </div>
    <div class="mt-6">
      <label class="block mt-4 text-lg font-medium text-gray-500">Telefono numeris</label>
      <div class="relative">
        <div class="absolute inset-y-0 start-0 flex items-center ps-2 pointer-events-none">
          <img :src="Phone" class="w-6 h-6 text-gray-400" alt="Phone" />
        </div>
        <input
          v-model="phone"
          type="tel"
          placeholder="Įveskite telefono numerį..."
          class="mt-1 block w-full px-4 py-3 bg-gray-200 rounded-md placeholder-gray-800 font-extralight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent ps-10 p-2.5"
        />
      </div>
    </div>
    <div class="text-red-500 text-sm mt-1 absolute w-full" v-if="props.errorMessages.phone">
      {{ props.errorMessages.phone }}
    </div>
  </div>
</template>

<script setup lang="ts">
import debounce from 'debounce'

import Email from '@/assets/Email.svg'
import Phone from '@/assets/PhoneNumber.svg'
import { onMounted, ref } from 'vue'

const name = ref('')
const surname = ref('')
const position = ref('')
const email = ref('')
const phone = ref('')

const props = defineProps<{
  errorMessages: {
    name?: string
    surname?: string
    position?: string
    email?: string
    phone?: string
  }
  startingValues?: [string, string, string, string, string]
}>()

onMounted(() => {
  if (props.startingValues) {
    name.value = props.startingValues[0]
    surname.value = props.startingValues[1]
    position.value = props.startingValues[2]
    email.value = props.startingValues[3]
    phone.value = props.startingValues[4]
  }
})

const emit = defineEmits<{
  'update:modelValue': [value: [string, string, string, string, string]]
}>()

const debouncedEmit = debounce((value: [string, string, string, string, string]) => {
  emit('update:modelValue', value)
}, 300)
</script>
