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
