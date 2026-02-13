<script setup>
import { X } from 'lucide-vue-next'
import { cn } from '@/lib/utils'

const props = defineProps({
  toast: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['dismiss'])

const variantClasses = {
  default: 'border bg-background text-foreground',
  destructive: 'border-destructive bg-destructive text-destructive-foreground',
}
</script>

<template>
  <div
    :class="cn(
      'pointer-events-auto flex w-full items-center justify-between gap-3 overflow-hidden rounded-lg p-4 shadow-lg transition-all',
      variantClasses[toast.variant] || variantClasses.default,
    )"
    role="alert"
  >
    <div class="flex-1">
      <p v-if="toast.title" class="text-sm font-semibold">{{ toast.title }}</p>
      <p v-if="toast.description" class="mt-0.5 text-xs opacity-90">{{ toast.description }}</p>
    </div>
    <button
      class="shrink-0 rounded-md p-1 opacity-70 hover:opacity-100 transition-opacity"
      @click="emit('dismiss', toast.id)"
    >
      <X :size="14" />
    </button>
  </div>
</template>
