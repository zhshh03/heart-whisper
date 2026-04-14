import request from '@/utils/http'

export const loginAPI = (data) => {
  return request({
    url: '/user/login',
    method: 'post',
    data,
  })
}

export const getCategory = () => {
  return request({
    url: '/knowledge/category/tree',
  })
}

export const getArticleListAPI = (params) => {
  return request({
    url: '/knowledge/article/page',
    params,
  })
}
