<template>
  <div class="fixed top-28 right-0 z-50 flex flex-col items-end mr-2 mt-2 space-y-2">
    <div
      class="bg-white shadow-lg rounded-lg border-l-8 flex items-center justify-between min-w-80 max-w-96 p-4"
      v-for="n in notifications"
      :key="n.id"
      :class="{
        'border-l-red-500': n.type === 'error',
        'border-l-green-500': n.type === 'success',
        'border-l-blue-500': n.type === 'info',
      }"
    >
      <p class="text-text flex-1 mr-3">{{ n.message }}</p>
      <button
        class="text-gray-400 hover:text-gray-600 text-xl leading-none"
        @click="notificationStore.removeNotificationById(n.id!)"
      >
        ×
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useNotificationStore } from '../stores/Notification'

const notificationStore = useNotificationStore()
const { notifications } = storeToRefs(notificationStore)
</script>
