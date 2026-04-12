import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Auth/login.vue'
import Home from '@/views/Auth/index.vue'
import Register from '@/views/Auth/register.vue'
import Backend from '@/views/BackendLayout/index.vue'
import Front from '@/views/FrontLayout/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: Home,
      children: [
        {
          path: '',
          component: Login,
        },
        {
          path: 'login',
          component: Login,
        },
        {
          path: 'register',
          component: Register,
        }
      ],
    },
    {
      path: '/backend',
      component: Backend,
    },
    {
      path: '/front',
      component: Front,
    }
  ],
})

export default router
