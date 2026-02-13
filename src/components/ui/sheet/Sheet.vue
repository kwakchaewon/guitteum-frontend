<script setup>
import { watch } from 'vue'
import { X } from 'lucide-vue-next'

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  side: {
    type: String,
    default: 'right',
    validator: (v) => ['left', 'right'].includes(v),
  },
})

const emit = defineEmits(['update:open'])

const close = () => {
  emit('update:open', false)
}

watch(() => props.open, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="duration-300"
      leave-active-class="duration-300"
    >
      <div v-if="open" class="fixed inset-0 z-50">
        <!-- 오버레이 -->
        <Transition
          enter-active-class="transition-opacity duration-300"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="transition-opacity duration-300"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
          appear
        >
          <div
            v-if="open"
            class="absolute inset-0 bg-black/50"
            @click="close"
          />
        </Transition>

        <!-- 시트 패널 -->
        <Transition
          enter-active-class="transition-transform duration-300 ease-out"
          :enter-from-class="side === 'right' ? 'translate-x-full' : '-translate-x-full'"
          enter-to-class="translate-x-0"
          leave-active-class="transition-transform duration-300 ease-in"
          leave-from-class="translate-x-0"
          :leave-to-class="side === 'right' ? 'translate-x-full' : '-translate-x-full'"
          appear
        >
          <div
            v-if="open"
            class="absolute top-0 bottom-0 flex w-80 max-w-[85vw] flex-col bg-background shadow-lg"
            :class="side === 'right' ? 'right-0' : 'left-0'"
          >
            <!-- 닫기 버튼 -->
            <button
              class="absolute right-3 top-3 z-10 rounded-sm p-1 text-muted-foreground hover:text-foreground transition-colors"
              @click="close"
            >
              <X :size="16" />
            </button>

            <slot />
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
