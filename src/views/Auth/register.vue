<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
</script>
<template>
  <div>注册页</div>
  <a href="" @click="router.push('/auth/login')">去登录</a>
</template>