import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getSpeeches, getSpeechById } from '@/api/speechApi'

export const useSpeechStore = defineStore('speech', () => {
  const speeches = ref([])
  const currentSpeech = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const pagination = ref({
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
  })

  const fetchSpeeches = async (params = {}) => {
    loading.value = true
    error.value = null
    try {
      const { data } = await getSpeeches({
        page: pagination.value.page,
        size: pagination.value.size,
        ...params,
      })
      speeches.value = data.content || data
      if (data.totalElements !== undefined) {
        pagination.value.totalElements = data.totalElements
        pagination.value.totalPages = data.totalPages
      }
    } catch (err) {
      error.value = err.message
      console.error('[SpeechStore] fetchSpeeches error:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchSpeechById = async (id) => {
    loading.value = true
    error.value = null
    try {
      const { data } = await getSpeechById(id)
      currentSpeech.value = data
    } catch (err) {
      error.value = err.message
      console.error('[SpeechStore] fetchSpeechById error:', err)
    } finally {
      loading.value = false
    }
  }

  const setPage = (page) => {
    pagination.value.page = page
  }

  return {
    speeches,
    currentSpeech,
    loading,
    error,
    pagination,
    fetchSpeeches,
    fetchSpeechById,
    setPage,
  }
})
