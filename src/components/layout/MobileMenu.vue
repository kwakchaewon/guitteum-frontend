<script setup>
import { RouterLink } from 'vue-router'

defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  navItems: {
    type: Array,
    required: true,
  },
  isActive: {
    type: Function,
    required: true,
  },
})

const emit = defineEmits(['close'])
</script>

<template>
  <Transition
    enter-active-class="transition-all duration-200 ease-out"
    enter-from-class="opacity-0 -translate-y-2"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition-all duration-150 ease-in"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 -translate-y-2"
  >
    <nav v-if="isOpen" class="border-b border-border/40 bg-background px-4 pb-4 md:hidden">
      <div class="flex flex-col space-y-1">
        <RouterLink
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
          :class="isActive(item.path) ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'"
          @click="emit('close')"
        >
          <component :is="item.icon" :size="18" />
          {{ item.name }}
        </RouterLink>
      </div>
    </nav>
  </Transition>
</template>
