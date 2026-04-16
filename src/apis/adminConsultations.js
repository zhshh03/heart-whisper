import request from '@/utils/http'

export const getConsultationListAPI = (params) => {
  return request({
    url: '/psychological-chat/sessions',
    params,
  })
}

export const getConsultationDetailAPI = (sessionId) => {
  return request({
    url: `/psychological-chat/sessions/${sessionId}/messages`,
  })
}
