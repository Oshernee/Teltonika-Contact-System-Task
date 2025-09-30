<template>
  <transition name="modal-fade">
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="fixed inset-0 bg-black bg-opacity-80" @click="close()"></div>
      <div
        class="relative bg-gradient-to-br from-slate-700 to-slate-600 rounded-lg border border-slate-500 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto"
      >
        <button
          class="absolute top-2.5 right-4 bg-transparent border-none text-2xl text-gray-100 cursor-pointer z-10 w-7 h-7 flex items-center justify-center rounded-full transition-colors duration-200 hover:bg-white hover:bg-opacity-10 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          @click="close()"
          aria-label="Close modal"
        >
          ×
        </button>
        <section class="p-6 text-gray-100">
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
const currentComponent = shallowRef(null)
const componentProps = ref({})

const emit = defineEmits<{
  close: []
  update: []
  cancel: []
  delete: []
  updateCurrent: []
  modalEvent: [eventName: string, data: any]
}>()

const open = (component: any, props = {}) => {
  currentComponent.value = component
  componentProps.value = props
  isOpen.value = true
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

const updateCurrent = () => {
  emit('updateCurrent')
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
