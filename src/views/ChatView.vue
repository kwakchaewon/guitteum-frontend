<script setup>
import { ref, nextTick, onMounted, watch } from 'vue'
import { MessageSquare, RotateCcw, Loader2, History, Square } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Sheet } from '@/components/ui/sheet'
import { useChatStore } from '@/stores/chatStore'
import ChatBubble from '@/components/chat/ChatBubble.vue'
import ChatInput from '@/components/chat/ChatInput.vue'
import ChatHistory from '@/components/chat/ChatHistory.vue'

const chatStore = useChatStore()
const messagesContainer = ref(null)
const historyOpen = ref(false)

const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const handleSend = async (text) => {
  await scrollToBottom()
  try {
    await chatStore.sendMessageStream(text)
  } catch {
    // 에러는 store에서 처리
  }
}

// 스트리밍 중 자동 스크롤
watch(
  () => chatStore.messages.find((m) => m.streaming)?.content,
  () => {
    if (chatStore.streaming) {
      scrollToBottom()
    }
  },
)

const handleNewChat = () => {
  chatStore.resetSession()
}

const handleStop = () => {
  chatStore.stopCurrentStream()
}

const handleSelectSession = async (id) => {
  await chatStore.loadSession(id)
  scrollToBottom()
}

onMounted(() => {
  if (chatStore.hasMessages) {
    scrollToBottom()
  }
})
</script>

<template>
  <div class="flex h-[calc(100vh-3.5rem)] flex-col">
    <!-- 헤더 바 -->
    <div class="flex items-center justify-between border-b border-border px-4 py-3">
      <div class="flex items-center gap-2">
        <MessageSquare :size="18" class="text-primary" />
        <h1 class="text-sm font-semibold tracking-tight">AI 정책 챗봇</h1>
      </div>
      <div class="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          class="gap-1.5 text-xs text-muted-foreground"
          @click="historyOpen = true"
        >
          <History :size="14" />
          <span class="hidden sm:inline">기록</span>
        </Button>
        <Button
          v-if="chatStore.hasMessages"
          variant="ghost"
          size="sm"
          class="gap-1.5 text-xs text-muted-foreground"
          @click="handleNewChat"
        >
          <RotateCcw :size="14" />
          <span class="hidden sm:inline">새 대화</span>
        </Button>
      </div>
    </div>

    <!-- 메시지 영역 -->
    <div
      ref="messagesContainer"
      class="flex-1 overflow-y-auto"
    >
      <!-- 빈 상태 -->
      <div
        v-if="!chatStore.hasMessages && !chatStore.isProcessing"
        class="flex h-full flex-col items-center justify-center px-4"
      >
        <div class="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
          <MessageSquare :size="32" class="text-primary" />
        </div>
        <h2 class="mb-2 text-lg font-semibold tracking-tight">
          대통령 연설문에 대해 물어보세요
        </h2>
        <p class="mb-8 max-w-sm text-center text-sm text-muted-foreground">
          AI가 연설문을 분석하여 정책, 키워드, 맥락에 대한 답변을 제공합니다.
        </p>

        <!-- 예시 질문 -->
        <div class="grid w-full max-w-lg gap-2 md:grid-cols-2">
          <button
            v-for="example in [
              '경제 정책에 대해 어떤 연설이 있나요?',
              '외교 관련 주요 발언을 알려주세요',
              '복지 정책의 핵심 내용은 무엇인가요?',
              '환경 관련 정책 방향은 어떻게 되나요?',
            ]"
            :key="example"
            class="rounded-xl border border-border px-4 py-3 text-left text-xs text-muted-foreground hover:border-primary/30 hover:bg-muted/50 transition-colors"
            @click="handleSend(example)"
          >
            {{ example }}
          </button>
        </div>
      </div>

      <!-- 메시지 목록 -->
      <div v-else class="mx-auto max-w-3xl space-y-6 px-4 py-6">
        <ChatBubble
          v-for="msg in chatStore.messages"
          :key="msg.id"
          :role="msg.role"
          :content="msg.content"
          :sources="msg.sources"
          :streaming="msg.streaming || false"
        />

        <!-- 로딩 인디케이터 (JSON 응답 대기) -->
        <div v-if="chatStore.loading" class="flex gap-3">
          <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <Loader2 :size="16" class="animate-spin" />
          </div>
          <div class="rounded-2xl rounded-tl-md bg-muted px-4 py-3">
            <div class="flex items-center gap-1">
              <span class="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/50" style="animation-delay: 0ms" />
              <span class="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/50" style="animation-delay: 150ms" />
              <span class="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/50" style="animation-delay: 300ms" />
            </div>
          </div>
        </div>

        <!-- 에러 메시지 -->
        <div v-if="chatStore.error" class="flex justify-center">
          <div class="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-2 text-xs text-destructive">
            {{ chatStore.error }}
          </div>
        </div>
      </div>
    </div>

    <!-- 스트리밍 중지 버튼 -->
    <div v-if="chatStore.streaming" class="flex justify-center pb-2">
      <Button
        variant="outline"
        size="sm"
        class="gap-1.5 text-xs"
        @click="handleStop"
      >
        <Square :size="12" />
        생성 중지
      </Button>
    </div>

    <!-- 입력 영역 -->
    <ChatInput
      :disabled="chatStore.isProcessing"
      @send-message="handleSend"
    />

    <!-- 히스토리 사이드 패널 -->
    <Sheet v-model:open="historyOpen" side="right">
      <ChatHistory
        @select-session="handleSelectSession"
        @close="historyOpen = false"
      />
    </Sheet>
  </div>
</template>
