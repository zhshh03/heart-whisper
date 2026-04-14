import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAdminInfoStore = defineStore('adminInfo', () => {
  const token = ref('')
  const adminInfo = ref({})

  const setToken = (value) => {
    token.value = value
    localStorage.setItem('token', value)
  }
  const setAdminInfo = (obj) => {
    adminInfo.value = obj
    localStorage.setItem('adminInfo', JSON.stringify(obj))
  }
  const clearAdminInfo = () => {
    token.value = ''
    adminInfo.value = {}
    localStorage.removeItem('token')
    localStorage.removeItem('adminInfo')
  }

  return {
    token,
    adminInfo,
    setToken,
    setAdminInfo,
    clearAdminInfo,
  }
})
