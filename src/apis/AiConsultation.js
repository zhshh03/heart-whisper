import request from '@/utils/http'

export const createNewChatAPI = (data) => {
  return request({
    url: '/psychological-chat/session/start',
    method: 'post',
    data,
  })
}

export const getSessionListAPI = (params) => {
  return request({
    url: '/psychological-chat/sessions',
    params,
  })
}

export const deleteSessionAPI = (sessionId) => {
  return request({
    url: `/psychological-chat/sessions/${sessionId}`,
    method: 'delete',
  })
}

export const getSessionDetailAPI = (sessionId) => {
  return request({
    url: `/psychological-chat/sessions/${sessionId}/messages`,
  })
}

export const getSessionEmotionAPI = (sessionId) => {
  return request({
    url: `/psychological-chat/session/${sessionId}/emotion`,
  })
}
