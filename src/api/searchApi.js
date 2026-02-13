import api from './axios'

export const searchSpeeches = (params = {}) => {
  return api.get('/speeches/search', { params })
}
