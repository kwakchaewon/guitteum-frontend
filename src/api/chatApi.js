import api from './axios'

export const sendMessage = (sessionId, question) => {
  return api.post('/chat', { sessionId, question })
}

export const getSessionMessages = (sessionId, params = {}) => {
  return api.get(`/chat/sessions/${sessionId}/messages`, { params })
}

export const deleteSession = (sessionId) => {
  return api.delete(`/chat/sessions/${sessionId}`)
}
