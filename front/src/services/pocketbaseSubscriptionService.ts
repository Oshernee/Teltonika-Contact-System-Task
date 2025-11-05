import pb from '@/services/globalInstance'
import { useUserStore } from '@/stores/Auth'

export const subscribeToPermissionChanges = (id: string) => {
  const userStore = useUserStore()
  pb.collection('user_permissions').subscribe(id, (e) => {
    if (e.action === 'update') {
      userStore.savePermissions(e.record)
    }
  })
}

export const unsubscribeFromPermissionChanges = () => {
  pb.collection('user_permissions').unsubscribe()
}
