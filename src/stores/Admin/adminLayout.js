import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

export const useAdminLayoutStore = defineStore('adminLayout', () => {
  const router = useRouter()
  //导航栏标题
  const currentTitle = computed(() => {
    return router.currentRoute.value.meta.title || '数据分析'
  })

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
