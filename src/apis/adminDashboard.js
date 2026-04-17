import request from '@/utils/http'

export const getAdminDashboardAPI = () => {
  return request({
    url: '/data-analytics/overview',
  })
}

export const loginOutAPI = () => {
  return request({
    url: '/user/logout',
    method: 'POST',
  })
}
