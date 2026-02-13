<script setup>
import { ref } from 'vue'

const props = defineProps({
  defaultOpen: {
    type: Boolean,
    default: false,
  },
})

const open = ref(props.defaultOpen)

const toggle = () => {
  open.value = !open.value
}
</script>

<template>
  <div>
    <slot :open="open" :toggle="toggle" />
  </div>
</template>
