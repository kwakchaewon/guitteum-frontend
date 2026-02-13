<script setup>
import { ref } from 'vue'
import { Send } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'

defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['send-message'])

const message = ref('')

const handleSend = () => {
  const text = message.value.trim()
  if (!text) return
  emit('send-message', text)
  message.value = ''
}

const handleKeydown = (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    handleSend()
  }
}
</script>

<template>
  <div class="border-t border-border bg-background p-4">
    <div class="mx-auto flex max-w-3xl items-end gap-2">
      <textarea
        v-model="message"
        :disabled="disabled"
        placeholder="연설문에 대해 질문해 보세요..."
        rows="1"
        class="flex-1 resize-none rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
        @keydown="handleKeydown"
        @input="
          $event.target.style.height = 'auto';
          $event.target.style.height = Math.min($event.target.scrollHeight, 120) + 'px'
        "
      />
      <Button
        size="icon"
        :disabled="disabled || !message.trim()"
        class="h-11 w-11 shrink-0 rounded-xl"
        @click="handleSend"
      >
        <Send :size="18" />
      </Button>
    </div>
  </div>
</template>
