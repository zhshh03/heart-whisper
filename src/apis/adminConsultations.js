import request from '@/utils/http'

export const getConsultationListAPI = (params) => {
  return request({
    url: '/psychological-chat/sessions',
    params,
  })
}
