import api from './axios'

export const getTopKeywords = (params = { limit: 20 }) => {
  return api.get('/stats/keywords/top', { params })
}

export const getKeywordTrend = (keyword, params = {}) => {
  return api.get('/stats/keywords/trend', { params: { keyword, ...params } })
}

export const getMonthlySpeechCount = (params = {}) => {
  return api.get('/stats/speeches/monthly', { params })
}

export const getCategoryDistribution = () => {
  return api.get('/stats/speeches/category')
}

export const getSummary = () => {
  return api.get('/stats/summary')
}
