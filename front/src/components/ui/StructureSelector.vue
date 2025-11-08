<template>
  <div class="flex mb-2">
    <button
      :class="[buttonClass, selectedStructure === 'offices' ? selectedButton : nonSelectedButton]"
      @click="selectStructure(0)"
    >
      Ofisai</button
    ><button
      :class="[buttonClass, selectedStructure === 'divisions' ? selectedButton : nonSelectedButton]"
      @click="selectStructure(1)"
    >
      Padaliniai</button
    ><button
      :class="[
        buttonClass,
        selectedStructure === 'departments' ? selectedButton : nonSelectedButton,
      ]"
      @click="selectStructure(2)"
    >
      Skyriai</button
    ><button
      :class="[buttonClass, selectedStructure === 'groups' ? selectedButton : nonSelectedButton]"
      @click="selectStructure(3)"
    >
      Grupės
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const keys = ['offices', 'divisions', 'departments', 'groups']

const buttonClass =
  'h-12 w-48 mr-2 rounded-xl justify-center items-center flex hover:opacity-90 text-xl'
const selectedButton = 'border-2 border-accent bg-white text-accent'
const nonSelectedButton = 'bg-accent text-white'

const selectedStructure = ref('offices')

const emit = defineEmits(['structureSelected'])

const selectStructure = (index: number) => {
  selectedStructure.value = keys[index]
  emit('structureSelected', selectedStructure.value)
}
</script>
