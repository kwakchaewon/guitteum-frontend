<script setup>
import { computed } from 'vue'
import { User, Bot } from 'lucide-vue-next'
import SourceCard from './SourceCard.vue'

const props = defineProps({
  role: {
    type: String,
    required: true,
    validator: (v) => ['USER', 'ASSISTANT'].includes(v),
  },
  content: {
    type: String,
    required: true,
  },
  sources: {
    type: Array,
    default: () => [],
  },
  streaming: {
    type: Boolean,
    default: false,
  },
})

const isUser = computed(() => props.role === 'USER')
</script>

<template>
  <div
    class="flex gap-3"
    :class="isUser ? 'flex-row-reverse' : 'flex-row'"
  >
    <!-- 아바타 -->
    <div
      class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
      :class="isUser ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'"
    >
      <User v-if="isUser" :size="16" />
      <Bot v-else :size="16" />
    </div>

    <!-- 메시지 -->
    <div
      class="max-w-[85%] md:max-w-[70%]"
    >
      <div
        class="rounded-2xl px-4 py-3 text-sm leading-relaxed"
        :class="
          isUser
            ? 'rounded-tr-md bg-primary text-primary-foreground'
            : 'rounded-tl-md bg-muted text-foreground'
        "
      >
        <p class="whitespace-pre-wrap">{{ content }}<span
          v-if="streaming"
          class="ml-0.5 inline-block h-4 w-0.5 animate-blink bg-current align-middle"
        /></p>
      </div>

      <!-- 출처 카드 -->
      <SourceCard
        v-if="!isUser && sources.length > 0"
        :sources="sources"
        class="mt-2"
      />
    </div>
  </div>
</template>
