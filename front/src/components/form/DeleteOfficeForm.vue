<template>
  <div class="w-[600px] h-[250px] p-6 space-y-6">
    <div>
      <h2 class="text-2xl">Ar tikrai norite ištrinti {{ props.constants.type_accusative }}?</h2>
    </div>
    <div class="space-y-4">
      <div class="space-y-2">
        <p class="text-text text-lg">
          {{ props.constants.type_genitive }} pavadinimas: {{ props.structure.name }}
        </p>
      </div>
    </div>
    <div class="flex justify-end pt-10 gap-4">
      <button class="px-4 py-2 text-secondary font-bold text-2xl" @click="emit('close')">Ne</button>
      <button class="px-4 py-2 text-secondary font-bold text-2xl" @click="handleDelete">
        Taip
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Structure } from '@/types/structures'
import { deleteStructure } from '@/services/universalService'
import { useNotificationStore } from '@/stores/Notification'
import { useUserStore } from '@/stores/Auth'
import type { FilterLevel } from '@/types/filter'

const emit = defineEmits(['update', 'close', 'updateCurrent', 'delete'])

const notificationStore = useNotificationStore()
const userStore = useUserStore()

const props = defineProps<{
  structure: Structure
  constants: {
    type_accusative: string
    type_genitive: string
    structure_type: string
  }
  filterLevel: FilterLevel
}>()

const handleDelete = async () => {
  try {
    await userStore.refreshUser()
    if (userStore.permissions?.delete_structure !== true) {
      notificationStore.addErrorNotification(
        'Jūs neturite teisių ištrinti ' + props.constants.type_accusative,
        ''
      )
      emit('close')
      return
    }
    await deleteStructure(props.constants.structure_type, props.structure.id, props.filterLevel)
    notificationStore.addSuccessNotification(props.constants.type_genitive + ' sėkmingai ištrintas')
    emit('update')
    emit('close')
  } catch (error: any) {
    if (error.status === 406) {
      notificationStore.addErrorNotification(
        'Negalima ištrinti ' +
          props.constants.type_genitive.toLowerCase() +
          ', nes yra susietų įrašų',
        ''
      )
      emit('close')
      return
    }
    notificationStore.addErrorNotification(
      'Nepavyko ištrinti ' + props.constants.type_genitive,
      error
    )
  }
}
</script>
