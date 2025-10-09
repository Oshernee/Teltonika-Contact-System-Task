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
  const loginStatus = ref<boolean>(false)

  const setUser = (newUser: User, newAccessToken: string) => {
    user.value = newUser
    accessToken.value = newAccessToken
  }

  const clearUser = () => {
    unsubscribeFromPermissionChanges()
    user.value = null
    accessToken.value = null
    permissions.value = undefined
    localStorage.removeItem('pocketbase_auth')
  }

  const isLoggedIn = () => {
    const pocketbase_auth = localStorage.getItem('pocketbase_auth')
    if (pocketbase_auth) {
      loginStatus.value = true
      return loginStatus.value
    }
    loginStatus.value = false
    return loginStatus.value
  }

  const isAdmin = () => {
    const pocketbase_auth = localStorage.getItem('pocketbase_auth')
    if (!pocketbase_auth) return false
    try {
      const authObj = JSON.parse(pocketbase_auth)
      return authObj.record?.name === 'Admin'
    } catch (e) {
      return false
    }
  }

  const reauthenticateOnPageReload = async () => {
    if (localStorage.getItem('pocketbase_auth') !== null) {
      await refreshUser()
      return true
    }
    return false
  }

  const refreshUser = async () => {
    const pocketbase_auth = localStorage.getItem('pocketbase_auth')
    if (!pocketbase_auth) {
      return
    }

    try {
      const { user, token: newToken, permissions: newPermissions } = await refreshUserInformation()
      setUser(user, newToken)
      savePermissions(newPermissions)
      return
    } catch (error) {
      console.log('Error refreshing user information:')
      console.log(error)

      if (error?.status === 401 || error?.status === 403) {
        clearUser()
      }
    }
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
    isAdmin,
    user,
    accessToken,
    permissions,
  }
})
