<script setup>
import { ref } from 'vue'
import { ChevronDown, FileText } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'

defineProps({
  sources: {
    type: Array,
    required: true,
  },
})

const open = ref(false)

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })
}
</script>

<template>
  <div class="rounded-lg border border-border bg-card">
    <!-- 헤더 (토글) -->
    <button
      class="flex w-full items-center justify-between px-3 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
      @click="open = !open"
    >
      <span class="flex items-center gap-1.5">
        <FileText :size="14" />
        출처 {{ sources.length }}건
      </span>
      <ChevronDown
        :size="14"
        class="transition-transform duration-200"
        :class="open ? 'rotate-180' : ''"
      />
    </button>

    <!-- 출처 목록 -->
    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="max-h-0 opacity-0"
      enter-to-class="max-h-96 opacity-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="max-h-96 opacity-100"
      leave-to-class="max-h-0 opacity-0"
    >
      <div v-if="open" class="overflow-hidden border-t border-border">
        <div class="space-y-1 p-2">
          <RouterLink
            v-for="source in sources"
            :key="source.speechId"
            :to="{ name: 'speech-detail', params: { id: source.speechId } }"
            class="flex items-start gap-2 rounded-md px-2 py-1.5 text-xs hover:bg-muted/50 transition-colors"
          >
            <FileText :size="12" class="mt-0.5 shrink-0 text-primary" />
            <div class="min-w-0">
              <p class="truncate font-medium text-foreground">{{ source.speechTitle }}</p>
              <p class="text-muted-foreground">{{ formatDate(source.speechDate) }}</p>
            </div>
          </RouterLink>
        </div>
      </div>
    </Transition>
  </div>
</template>
