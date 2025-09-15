import pb from '../utils/globalInstance'
import { useUserStore } from '../stores/Auth'

export const subscribeToPermissionChanges = (id: string) => {
  const userStore = useUserStore()
  console.log('Subscribing to permission changes for id:', id)
  pb.collection('user_permissions').subscribe(id, (e) => {
    if (e.action === 'update') {
      userStore.savePermissions(e.record.permissions)
    }
  })
}

export const unsubscribeFromPermissionChanges = (id: string) => {
  console.log('Unsubscribing from permission changes for id:', id)
  pb.collection('user_permissions').unsubscribe(id)
}
