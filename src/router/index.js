import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Auth/login.vue'
import Auth from '@/views/Auth/index.vue'
import Register from '@/views/Auth/register.vue'
import Backend from '@/views/BackendLayout/index.vue'
import Front from '@/views/FrontLayout/index.vue'
import Dashboard from '@/views/Dashboard/dashboard.vue'
import Knowledge from '@/views/Dashboard/knowledge.vue'
import Consultations from '@/views/Dashboard/consultations.vue'
import Emotional from '@/views/Dashboard/emotional.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/front',
    },
    {
      path: '/auth',
      component: Auth,
      children: [
        {
          path: '/auth/login',
          component: Login,
        },
        {
          path: '/auth/register',
          component: Register,
        },
      ],
    },
    {
      path: '/back',
      redirect: '/back/dashboard',
      component: Backend,
      children: [
        {
          path: '/back/dashboard',
          component: Dashboard,
          meta: {
            title: '数据分析',
            icon: 'PieChart',
          },
        },
        {
          path: '/back/knowledge',
          component: Knowledge,
          meta: {
            title: '知识文章',
            icon: 'ChatLineSquare',
          },
        },
        {
          path: '/back/consultations',
          component: Consultations,
          meta: {
            title: '咨询记录',
            icon: 'Message',
          },
        },
        {
          path: '/back/emotional',
          component: Emotional,
          meta: {
            title: '情绪日志',
            icon: 'User',
          },
        },
      ],
    },
    {
      path: '/front',
      component: Front,
    },
  ],
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (token) {
    const adminInfo = JSON.parse(localStorage.getItem('adminInfo'))
    if (adminInfo.userType === 2) {
      if (to.path.startsWith('/back')) {
        next()
      } else {
        next('/back/dashboard')
      }
    } else if (adminInfo.userType === 1) {
      if (to.path.startsWith('/front')) {
        next()
      } else {
        next('/front')
      }
    } else {
      next('/auth/login')
    }
  } else {
    if (to.path.startsWith('/back')) {
      next('/auth/login')
    } else {
      next()
    }
  }
})

export default router
