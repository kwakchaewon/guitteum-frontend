<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
})

const visible = ref(false)
const finishing = ref(false)

watch(() => props.loading, (isLoading) => {
  if (isLoading) {
    visible.value = true
    finishing.value = false
  } else if (visible.value) {
    finishing.value = true
    setTimeout(() => {
      visible.value = false
      finishing.value = false
    }, 300)
  }
})
</script>

<template>
  <div
    v-if="visible"
    class="fixed left-0 top-0 z-[9999] h-0.5 w-full"
  >
    <div
      class="h-full bg-primary transition-all duration-300 ease-out"
      :class="finishing ? 'w-full' : 'w-4/5 animate-pulse'"
    />
  </div>
</template>
