import axios from 'axios'
import { ref } from 'vue'
import { useToast } from '@/composables/useToast'

export const activeRequests = ref(0)
export const isGlobalLoading = ref(false)

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  activeRequests.value++
  isGlobalLoading.value = true
  return config
})

api.interceptors.response.use(
  (response) => {
    activeRequests.value--
    if (activeRequests.value <= 0) {
      activeRequests.value = 0
      isGlobalLoading.value = false
    }
    return response
  },
  (error) => {
    activeRequests.value--
    if (activeRequests.value <= 0) {
      activeRequests.value = 0
      isGlobalLoading.value = false
    }

    const { toast } = useToast()
    const status = error.response?.status
    const message = error.response?.data?.message

    if (status === 404) {
      toast.error('찾을 수 없음', message || '요청한 리소스를 찾을 수 없습니다.')
    } else if (status === 500) {
      toast.error('서버 오류', message || '서버에서 오류가 발생했습니다.')
    } else if (error.code === 'ECONNABORTED') {
      toast.error('요청 시간 초과', '서버 응답이 너무 느립니다. 다시 시도해 주세요.')
    } else if (!error.response) {
      toast.error('네트워크 오류', '서버에 연결할 수 없습니다.')
    }

    console.error('[API Error]', status, error.message)
    return Promise.reject(error)
  },
)

export default api
