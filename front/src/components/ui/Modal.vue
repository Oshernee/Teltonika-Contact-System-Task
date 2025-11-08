<template>
  <transition name="modal-fade">
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="fixed inset-0 bg-black bg-opacity-80" @click="close()"></div>
      <div
        class="relative bg-gradient-to-br bg-white rounded-lg border max-w-[1250px] mx-4 max-h-[90vh] overflow-y-auto"
      >
        <button
          v-if="!showClose"
          class="absolute top-4 right-4 text-white text-3xl bg-secondary rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-80 cursor-pointer z-10"
          @click="close()"
          aria-label="Close modal"
        >
          <span class="leading-none pb-1">×</span>
        </button>
        <section class="p-6 text-black">
          <component
            v-if="currentComponent"
            :is="currentComponent"
            v-bind="componentProps"
            @close="close"
            @update="updatePages"
            @updateCurrent="updateCurrent"
            @delete="redirectToMain"
            v-on="$attrs"
          />
          <slot v-else></slot>
        </section>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, shallowRef } from 'vue'

const isOpen = ref(false)
const showClose = ref(false)
const currentComponent = shallowRef(null)
const componentProps = ref({})

const emit = defineEmits<{
  close: []
  update: []
  cancel: []
  delete: []
  updateCurrent: [password: string]
  modalEvent: [eventName: string, data: any]
}>()

const open = (component: any, props = {}, isDelete: boolean) => {
  currentComponent.value = component
  componentProps.value = props
  isOpen.value = true
  showClose.value = isDelete
}

const close = () => {
  isOpen.value = false
  currentComponent.value = null
  componentProps.value = {}
  emit('close')
}

const updatePages = () => {
  emit('update')
}

const updateCurrent = (password: string) => {
  emit('updateCurrent', password)
}

const redirectToMain = () => {
  emit('delete')
}

defineExpose({
  open,
  close,
  isOpen,
})
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
