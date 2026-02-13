import { ref } from 'vue'

/**
 * SSE 스트리밍 composable (POST 요청 지원)
 * EventSource는 GET만 지원하므로 fetch + ReadableStream 사용
 */
export const useSSE = () => {
  const streaming = ref(false)
  const error = ref(null)
  let abortController = null

  const startStream = async (url, body, { onToken, onSources, onDone, onError } = {}) => {
    streaming.value = true
    error.value = null
    abortController = new AbortController()

    try {
      const baseURL = import.meta.env.VITE_API_BASE_URL || '/api'
      const response = await fetch(`${baseURL}${url}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: abortController.signal,
      })

      if (!response.ok) {
        throw new Error(`서버 오류 (${response.status})`)
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        let eventType = null
        for (const line of lines) {
          if (line.startsWith('event:')) {
            eventType = line.slice(6).trim()
          } else if (line.startsWith('data:')) {
            const dataStr = line.slice(5).trim()
            if (!dataStr) continue

            try {
              const data = JSON.parse(dataStr)

              if (eventType === 'token' || (!eventType && data.text !== undefined)) {
                onToken?.(data.text)
              } else if (eventType === 'sources') {
                onSources?.(data.sources || [])
              } else if (eventType === 'done') {
                onDone?.(data)
              }
            } catch {
              // JSON 파싱 실패 시 텍스트로 처리
              if (eventType === 'token' || !eventType) {
                onToken?.(dataStr)
              }
            }

            eventType = null
          }
        }
      }

      // 스트림 종료 후 done 이벤트가 없었으면 호출
      onDone?.()
    } catch (err) {
      if (err.name === 'AbortError') return

      error.value = err.message || '스트리밍 연결에 실패했습니다.'
      onError?.(err)
    } finally {
      streaming.value = false
      abortController = null
    }
  }

  const stopStream = () => {
    if (abortController) {
      abortController.abort()
      abortController = null
    }
    streaming.value = false
  }

  return {
    streaming,
    error,
    startStream,
    stopStream,
  }
}
