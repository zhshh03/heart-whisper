<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<template>
  <div>登录页</div>
  <a href="" @click="router.push('/front')">去用户页</a>
  <a href="" @click="router.push('/back')">去后台管理页</a>
  <a href="" @click="router.push('/auth/register')">去注册</a>
</template>

<style scoped>

a{
  margin-right: 10px;
}

</style>