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

export const updataFile = (file, businessInfo) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('businessType', 'ARTICLE')
  formData.append('businessId', businessInfo.businessId)
  formData.append('businessField', 'cover')
  return request({
    url: '/file/upload',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

export const addArticleAPI = (data) => {
  return request({
    url: '/knowledge/article',
    method: 'post',
    data,
  })
}

export const getArticleDetailAPI = (id) => {
  return request({
    url: `/knowledge/article/${id}`,
  })
}

export const updateArticleAPI = (id, data) => {
  return request({
    url: `/knowledge/article/${id}`,
    method: 'put',
    data,
  })
}

export const deleteArticleAPI = (id) => {
  return request({
    url: `/knowledge/article/${id}`,
    method: 'delete',
  })
}

export const updataArticleStatusAPI = (id, data) => {
  return request({
    url: `/knowledge/article/${id}/status`,
    method: 'put',
    data,
  })
}
