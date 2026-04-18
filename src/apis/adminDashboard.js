import request from '@/utils/http'

export const getAdminDashboardAPI = () => {
  return request({
    url: '/data-analytics/overview',
  })
}
