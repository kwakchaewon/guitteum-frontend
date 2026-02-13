<script setup>
import { MessageSquare, Trash2, Clock } from 'lucide-vue-next'
import { useChatStore } from '@/stores/chatStore'

const chatStore = useChatStore()

const emit = defineEmits(['select-session', 'close'])

const formatTime = (dateStr) => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  const now = new Date()
  const diff = now - d

  if (diff < 60 * 60 * 1000) {
    const mins = Math.floor(diff / (60 * 1000))
    return mins <= 0 ? '방금 전' : `${mins}분 전`
  }
  if (diff < 24 * 60 * 60 * 1000) {
    return `${Math.floor(diff / (60 * 60 * 1000))}시간 전`
  }
  if (diff < 7 * 24 * 60 * 60 * 1000) {
    return `${Math.floor(diff / (24 * 60 * 60 * 1000))}일 전`
  }
  return d.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })
}

const handleSelect = (session) => {
  emit('select-session', session.id)
  emit('close')
}

const handleDelete = async (e, session) => {
  e.stopPropagation()
  await chatStore.deleteSessionById(session.id)
}
</script>

<template>
  <div class="flex h-full flex-col">
    <!-- 헤더 -->
    <div class="border-b border-border px-4 py-3">
      <h2 class="text-sm font-semibold tracking-tight">대화 기록</h2>
    </div>

    <!-- 세션 목록 -->
    <div class="flex-1 overflow-y-auto">
      <div v-if="chatStore.sessions.length === 0" class="flex flex-col items-center justify-center px-4 py-12">
        <Clock :size="24" class="mb-2 text-muted-foreground/50" />
        <p class="text-xs text-muted-foreground">대화 기록이 없습니다.</p>
      </div>

      <div v-else class="space-y-0.5 p-2">
        <button
          v-for="session in chatStore.sessions"
          :key="session.id"
          class="group flex w-full items-start gap-2 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-muted/50"
          :class="chatStore.sessionId === session.id ? 'bg-muted' : ''"
          @click="handleSelect(session)"
        >
          <MessageSquare :size="14" class="mt-0.5 shrink-0 text-muted-foreground" />
          <div class="min-w-0 flex-1">
            <p class="truncate text-xs font-medium text-foreground">{{ session.title }}</p>
            <p class="mt-0.5 text-[10px] text-muted-foreground">
              {{ formatTime(session.updatedAt) }}
            </p>
          </div>
          <button
            class="shrink-0 rounded p-1 text-muted-foreground opacity-0 hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100 transition-all"
            @click="handleDelete($event, session)"
          >
            <Trash2 :size="12" />
          </button>
        </button>
      </div>
    </div>
  </div>
</template>
