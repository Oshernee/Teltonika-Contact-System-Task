import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User } from '@/types/users'
import type { UserPermission } from '@/types/user_permissions'
import { refreshUserInformation } from '@/services/userService'
import { unsubscribeFromPermissionChanges } from '@/services/pocketbaseSubscriptionService'

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)
  const accessToken = ref<string | null>(null)
  const permissions = ref<UserPermission>()

  const setUser = (newUser: User, newAccessToken: string) => {
    user.value = newUser
    accessToken.value = newAccessToken
  }

  const clearUser = () => {
    unsubscribeFromPermissionChanges(user.value?.permissions_id || '')
    user.value = null
    accessToken.value = null
    permissions.value = undefined
    localStorage.removeItem('pocketbase_auth')
  }

  const isLoggedIn = () => {
    return (
      user.value !== null &&
      accessToken.value !== null &&
      localStorage.getItem('pocketbase_auth') !== null
    )
  }

  const reauthenticateOnPageReload = async () => {
    if (localStorage.getItem('pocketbase_auth') !== null) {
      refreshUser()
      return true
    }
    return false
  }

  const refreshUser = async () => {
    const pocketbase_auth = localStorage.getItem('pocketbase_auth')
    if (pocketbase_auth) {
      const { user, token: newToken, permissions: newPermissions } = await refreshUserInformation()
      setUser(user, newToken)
      savePermissions(newPermissions)
      return
    } else {
      clearUser()
    }
    return
  }

  const savePermissions = (perms: UserPermission) => {
    permissions.value = perms
  }

  return {
    setUser,
    isLoggedIn,
    reauthenticateOnPageReload,
    clearUser,
    savePermissions,
    refreshUser,
    user,
    accessToken,
    permissions,
  }
})
