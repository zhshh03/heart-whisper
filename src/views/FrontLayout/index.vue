<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

</script>

<template>
  <div>用户页</div>
  <el-button type="text" @click="router.push('/Auth/login')">去登录</el-button>
</template>