<template>
  <div>
    <h1 class="text-xl mb-2">Pavadinimas:</h1>
    <input
      maxlength="255"
      :placeholder="'Įveskite ofiso pavadinimą'"
      type="text"
      class="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      :class="{ 'border-red-500': errors.name }"
      v-model="office.name"
      @input="updateValues"
    />
    <div v-show="errors.name" class="text-red-500 mb-2">{{ errors.name }}</div>
    <h1 class="text-xl mb-2">Gatvė:</h1>
    <input
      maxlength="100"
      :placeholder="'Įveskite ofiso gatvę'"
      type="text"
      class="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      :class="{ 'border-red-500': errors.street }"
      v-model="office.street"
      @input="updateValues"
    />
    <div v-show="errors.street" class="text-red-500 mb-2">{{ errors.street }}</div>
    <h1 class="text-xl mb-2">Gatvės numeris:</h1>
    <input
      maxlength="10"
      :placeholder="'Įveskite ofiso gatvės numerį'"
      type="text"
      class="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      :class="{ 'border-red-500': errors.street_number }"
      v-model="office.street_number"
      @input="updateValues"
    />
    <div v-show="errors.street_number" class="text-red-500 mb-2">{{ errors.street_number }}</div>
    <h1 class="text-xl mb-2">Miestas:</h1>
    <input
      maxlength="100"
      :placeholder="'Įveskite ofiso miestą'"
      type="text"
      class="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      :class="{ 'border-red-500': errors.city }"
      v-model="office.city"
      @input="updateValues"
    />
    <div v-show="errors.city" class="text-red-500 mb-2">{{ errors.city }}</div>
    <h1 class="text-xl mb-2">Šalis:</h1>
    <input
      maxlength="100"
      :placeholder="'Įveskite ofiso šalį'"
      type="text"
      class="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      :class="{ 'border-red-500': errors.country }"
      v-model="office.country"
      @input="updateValues"
    />
    <div v-show="errors.country" class="text-red-500 mb-2">{{ errors.country }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import debounce from 'debounce'

const props = defineProps<{
  office: {
    name: string
    street: string
    street_number: string
    city: string
    country: string
  }
  errors: {
    name: string | null
    street: string | null
    street_number: string | null
    city: string | null
    country: string | null
  }
}>()

const office = ref({
  ...props.office,
})

const errors = computed(() => {
  return props.errors
})

const emit = defineEmits(['update:values'])

const updateValues = debounce(() => {
  emit('update:values', office.value)
}, 300)
</script>
