import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { sendMessage as sendChatMessage, getSessionMessages, deleteSession } from '@/api/chatApi'

export const useChatStore = defineStore('chat', () => {
  const sessionId = ref(null)
  const messages = ref([])
  const loading = ref(false)
  const error = ref(null)

  const hasMessages = computed(() => messages.value.length > 0)

  const initSession = () => {
    if (!sessionId.value) {
      sessionId.value = crypto.randomUUID()
    }
  }

  const addMessage = (role, content, sources = []) => {
    messages.value.push({
      id: Date.now(),
      role,
      content,
      sources,
      createdAt: new Date().toISOString(),
    })
  }

  const sendMessage = async (question) => {
    initSession()
    addMessage('USER', question)

    loading.value = true
    error.value = null

    try {
      const { data } = await sendChatMessage(sessionId.value, question)

      if (data.sessionId) {
        sessionId.value = data.sessionId
      }

      addMessage('ASSISTANT', data.message, data.sources || [])
      return data
    } catch (err) {
      error.value = err.message || '답변 생성에 실패했습니다.'
      throw err
    } finally {
      loading.value = false
    }
  }

  const loadHistory = async () => {
    if (!sessionId.value) return

    loading.value = true
    try {
      const { data } = await getSessionMessages(sessionId.value)
      messages.value = (data.content || data).map((msg) => ({
        id: msg.id,
        role: msg.role,
        content: msg.content,
        sources: msg.sources || [],
        createdAt: msg.createdAt,
      }))
    } catch {
      // 세션이 없으면 무시
    } finally {
      loading.value = false
    }
  }

  const clearChat = async () => {
    if (sessionId.value) {
      try {
        await deleteSession(sessionId.value)
      } catch {
        // 삭제 실패해도 로컬 초기화
      }
    }
    sessionId.value = null
    messages.value = []
    error.value = null
  }

  const resetSession = () => {
    sessionId.value = null
    messages.value = []
    error.value = null
  }

  return {
    sessionId,
    messages,
    loading,
    error,
    hasMessages,
    initSession,
    sendMessage,
    loadHistory,
    clearChat,
    resetSession,
  }
})
