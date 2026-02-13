import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  getTopKeywords,
  getKeywordTrend,
  getMonthlySpeechCount,
  getCategoryDistribution,
  getSummary,
} from '@/api/statsApi'

export const useStatsStore = defineStore('stats', () => {
  const summary = ref(null)
  const topKeywords = ref([])
  const monthlyData = ref([])
  const categoryData = ref([])
  const trendData = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchSummary = async () => {
    try {
      const { data } = await getSummary()
      summary.value = data
    } catch {
      // 무시
    }
  }

  const fetchTopKeywords = async (limit = 20) => {
    try {
      const { data } = await getTopKeywords({ limit })
      topKeywords.value = data
    } catch {
      topKeywords.value = []
    }
  }

  const fetchMonthlyData = async () => {
    try {
      const { data } = await getMonthlySpeechCount()
      monthlyData.value = data
    } catch {
      monthlyData.value = []
    }
  }

  const fetchCategoryData = async () => {
    try {
      const { data } = await getCategoryDistribution()
      categoryData.value = data
    } catch {
      categoryData.value = []
    }
  }

  const fetchKeywordTrend = async (keyword, params = {}) => {
    try {
      const { data } = await getKeywordTrend(keyword, params)
      trendData.value = data
    } catch {
      trendData.value = []
    }
  }

  const fetchAll = async () => {
    loading.value = true
    error.value = null
    try {
      await Promise.all([
        fetchSummary(),
        fetchTopKeywords(),
        fetchMonthlyData(),
        fetchCategoryData(),
      ])
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  return {
    summary,
    topKeywords,
    monthlyData,
    categoryData,
    trendData,
    loading,
    error,
    fetchSummary,
    fetchTopKeywords,
    fetchMonthlyData,
    fetchCategoryData,
    fetchKeywordTrend,
    fetchAll,
  }
})
