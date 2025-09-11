import { defineStore } from 'pinia'
import { readonly, ref } from 'vue'
import type Notification from '../types/notification'

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref<Notification[]>([])
  let globalTimer: number | null = null

  const addSuccessNotification = (message: string) => {
    if (checkForDuplicate(message)) {
      return
    }

    const id = crypto.randomUUID()
    notifications.value.unshift({ message, type: 'success', id })

    if (!globalTimer) {
      startGlobalTimer()
    }
  }

  const addErrorNotification = (message: string, error: any) => {
    if (checkForDuplicate(message)) {
      return
    }

    if (
      error.message?.includes('autocancelled') ||
      error.cause?.name === 'AbortError' ||
      error.name === 'AbortError'
    ) {
      console.log('Request was auto-cancelled, ignoring error')
      return
    }

    const id = crypto.randomUUID()
    notifications.value.unshift({ message, type: 'error', id })

    if (!globalTimer) {
      startGlobalTimer()
    }
  }

  const addInfoNotification = (message: string) => {
    if (checkForDuplicate(message)) {
      return
    }

    const id = crypto.randomUUID()
    notifications.value.unshift({ message, type: 'info', id })

    if (!globalTimer) {
      startGlobalTimer()
    }
  }

  const startGlobalTimer = () => {
    globalTimer = setInterval(() => {
      if (notifications.value.length > 0) {
        notifications.value.pop()
      }

      if (notifications.value.length === 0) {
        stopGlobalTimer()
      }
    }, 5000)
  }

  const stopGlobalTimer = () => {
    if (globalTimer) {
      clearInterval(globalTimer)
      globalTimer = null
    }
  }

  const removeNotificationById = (id: string) => {
    notifications.value = notifications.value.filter((n) => n.id !== id)
    if (notifications.value.length === 0) {
      stopGlobalTimer()
    }
  }

  const checkForDuplicate = (message: string) => {
    return notifications.value.some((n) => n.message === message)
  }

  return {
    notifications: readonly(notifications),
    addSuccessNotification,
    addErrorNotification,
    addInfoNotification,
    removeNotificationById,
  }
})
