import request from '@/utils/http'

export const getEmotionalListAPI = (params) => {
  return request({
    url: '/emotion-diary/admin/page',
    params,
  })
}

export const deleteEmotionslAPI = (id) => {
  return request({
    url: `/emotion-diary/admin/${id}`,
    method: 'delete',
  })
}
