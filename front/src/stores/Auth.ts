import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User } from '../types/users'
import type { UserPermission } from '../types/user_permissions'
import { unsubscribeFromPermissionChanges } from '../services/pocketbaseSubscriptionService'

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)
  const accessToken = ref<string | null>(null)
  const permissions = ref<UserPermission>()

  const setUser = (newUser: User, newAccessToken: string) => {
    user.value = newUser
    accessToken.value = newAccessToken
    localStorage.setItem('accessToken', newAccessToken)
    localStorage.setItem('user', JSON.stringify(newUser))
  }

  const clearUser = () => {
    unsubscribeFromPermissionChanges(user.value?.permissions_id || '')
    user.value = null
    accessToken.value = null
    localStorage.removeItem('accessToken')
    localStorage.removeItem('user')
  }

  const isLoggedIn = () => {
    return (
      user.value !== null &&
      accessToken.value !== null &&
      localStorage.getItem('accessToken') !== null &&
      localStorage.getItem('user') !== null
    )
  }

  const refreshUser = () => {
    const userId = localStorage.getItem('user')
    const token = localStorage.getItem('accessToken')
    if (userId && token) {
      setUser(JSON.parse(localStorage.getItem('user') || '{}'), token)
      return true
    }
    return false
  }

  const savePermissions = (perms: UserPermission) => {
    permissions.value = perms
  }

  return {
    setUser,
    isLoggedIn,
    clearUser,
    savePermissions,
    refreshUser,
    user,
    accessToken,
    permissions,
  }
})
