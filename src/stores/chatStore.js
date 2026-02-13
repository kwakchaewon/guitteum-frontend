import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { sendMessage as sendChatMessage, getSessionMessages, deleteSession } from '@/api/chatApi'
import { useSSE } from '@/composables/useSSE'

const SESSIONS_STORAGE_KEY = 'guitteum_chat_sessions'

const loadSavedSessions = () => {
  try {
    const saved = localStorage.getItem(SESSIONS_STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

const saveSessions = (sessions) => {
  try {
    localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessions))
  } catch {
    // 스토리지 오류 무시
  }
}

export const useChatStore = defineStore('chat', () => {
  const sessionId = ref(null)
  const messages = ref([])
  const loading = ref(false)
  const streaming = ref(false)
  const error = ref(null)
  const sessions = ref(loadSavedSessions())

  const hasMessages = computed(() => messages.value.length > 0)
  const isProcessing = computed(() => loading.value || streaming.value)

  const { startStream, stopStream } = useSSE()

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

  const saveCurrentSession = () => {
    if (!sessionId.value || messages.value.length === 0) return

    const firstUserMsg = messages.value.find((m) => m.role === 'USER')
    const title = firstUserMsg ? firstUserMsg.content.slice(0, 30) : '새 대화'

    const existing = sessions.value.findIndex((s) => s.id === sessionId.value)
    const sessionData = {
      id: sessionId.value,
      title,
      messageCount: messages.value.length,
      updatedAt: new Date().toISOString(),
    }

    if (existing >= 0) {
      sessions.value[existing] = sessionData
    } else {
      sessions.value.unshift(sessionData)
    }

    // 최대 20개 세션 유지
    if (sessions.value.length > 20) {
      sessions.value = sessions.value.slice(0, 20)
    }

    saveSessions(sessions.value)
  }

  // JSON 응답 방식
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
      saveCurrentSession()
      return data
    } catch (err) {
      error.value = err.message || '답변 생성에 실패했습니다.'
      throw err
    } finally {
      loading.value = false
    }
  }

  // SSE 스트리밍 방식
  const sendMessageStream = async (question) => {
    initSession()
    addMessage('USER', question)

    streaming.value = true
    error.value = null

    // 빈 AI 메시지를 미리 추가
    const aiMsgId = Date.now()
    messages.value.push({
      id: aiMsgId,
      role: 'ASSISTANT',
      content: '',
      sources: [],
      streaming: true,
      createdAt: new Date().toISOString(),
    })

    const aiMsgIndex = messages.value.length - 1

    await startStream(
      '/chat/stream',
      { sessionId: sessionId.value, question },
      {
        onToken: (text) => {
          messages.value[aiMsgIndex].content += text
        },
        onSources: (sources) => {
          messages.value[aiMsgIndex].sources = sources
        },
        onDone: () => {
          messages.value[aiMsgIndex].streaming = false
          streaming.value = false
          saveCurrentSession()
        },
        onError: (err) => {
          error.value = err.message || '스트리밍에 실패했습니다.'
          messages.value[aiMsgIndex].streaming = false
          if (!messages.value[aiMsgIndex].content) {
            messages.value[aiMsgIndex].content = '답변을 생성하지 못했습니다. 다시 시도해 주세요.'
          }
          streaming.value = false
        },
      },
    )
  }

  const stopCurrentStream = () => {
    stopStream()
    const streamingMsg = messages.value.find((m) => m.streaming)
    if (streamingMsg) {
      streamingMsg.streaming = false
    }
    streaming.value = false
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

  const loadSession = async (id) => {
    sessionId.value = id
    messages.value = []
    await loadHistory()
  }

  const clearChat = async () => {
    stopCurrentStream()
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
    stopCurrentStream()
    saveCurrentSession()
    sessionId.value = null
    messages.value = []
    error.value = null
  }

  const deleteSessionById = async (id) => {
    try {
      await deleteSession(id)
    } catch {
      // 무시
    }
    sessions.value = sessions.value.filter((s) => s.id !== id)
    saveSessions(sessions.value)

    if (sessionId.value === id) {
      sessionId.value = null
      messages.value = []
    }
  }

  return {
    sessionId,
    messages,
    loading,
    streaming,
    error,
    sessions,
    hasMessages,
    isProcessing,
    initSession,
    sendMessage,
    sendMessageStream,
    stopCurrentStream,
    loadHistory,
    loadSession,
    clearChat,
    resetSession,
    deleteSessionById,
  }
})
