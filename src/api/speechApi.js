import api from './axios'

export const getSpeeches = (params = {}) => {
  return api.get('/speeches', { params })
}

export const getSpeechById = (id) => {
  return api.get(`/speeches/${id}`)
}
