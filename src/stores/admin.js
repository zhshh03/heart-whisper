import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAdminStore = defineStore('admin', () => {
  const currentTitle = ref('数据分析')
  const isCollapse = ref(false)
  const toggleCollapse = () => {
    isCollapse.value = !isCollapse.value
  }
  return {
    currentTitle,
    isCollapse,
    toggleCollapse,
  }
})
