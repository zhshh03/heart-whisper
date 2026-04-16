import request from '@/utils/http'

export const getEmotionalListAPI = (params) => {
  return request({
    url: '/emotion-diary/admin/page',
    params,
  })
}
