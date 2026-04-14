import axios from 'axios'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useAdminInfoStore } from '@/stores/Admin/adminInfo'

const instance = axios.create({
  baseURL: '/api',
  timeout: 5000,
})

// 添加请求拦截器
instance.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['token'] = token
    }
    return config
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  },
)

// 添加响应拦截器
instance.interceptors.response.use(
  function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    return response.data
  },
  function (error) {
    const router = useRouter()
    const adminInfoStore = useAdminInfoStore()
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    const msg = error.response?.data?.message || '请求失败'

    if (error.response) {
      switch (error.response.status) {
        case 401:
          adminInfoStore.clearAdminInfo()
          router.push('/auth/login')
          break
        case 403:
          console.warn('没有权限')
          break
        case 404:
          console.warn('请求的资源不存在')
          break
        case 500:
          console.error('服务器错误')
          break
      }
    }
    ElMessage.error(msg)
    return Promise.reject(error)
  },
)

export default instance
