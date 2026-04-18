import request from '@/utils/http'

export const loginAPI = (data) => {
  return request({
    url: '/user/login',
    method: 'post',
    data,
  })
}

export const registerAPI = (data) => {
  return request({
    url: '/user/add',
    method: 'post',
    data,
  })
}

export const loginOutAPI = () => {
  return request({
    url: '/user/logout',
    method: 'POST',
  })
}
