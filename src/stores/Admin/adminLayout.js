import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAdminLayoutStore = defineStore('adminLayout', () => {
  //导航栏标题
  const currentTitle = ref('数据分析')
  //导航栏控制侧边栏状态
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
