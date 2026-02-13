import api from './axios'

export const sendMessage = (sessionId, question, category = '') => {
  const body = { sessionId, question }
  if (category) body.category = category
  return api.post('/chat', body)
}

export const getSessionMessages = (sessionId, params = {}) => {
  return api.get(`/chat/sessions/${sessionId}/messages`, { params })
}

export const deleteSession = (sessionId) => {
  return api.delete(`/chat/sessions/${sessionId}`)
}
