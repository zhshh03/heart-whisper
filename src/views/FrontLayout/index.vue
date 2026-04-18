<script setup>
import { onMounted, ref } from 'vue';

// import { useRouter } from 'vue-router'

// const router = useRouter()

const isLogin = ref(false)
const urlImg = new URL('@/assets/images/机器人.png', import.meta.url).href

onMounted(() => {
  isLogin.value = localStorage.getItem('token') !== null
})
</script>

<template>
  <div class="frontend-layout">
    <div class="navbar-container">
      <div class="brand-section">
        <el-image :src="urlImg" alt="心理健康助手" class="brand-logo" style="width: 50px; height: 50px;"></el-image>
        <h1 class="brand-name">心理健康AI助手</h1>
      </div>
      <div class="nav-section">
        <router-link to="/" class="nav-link">首页</router-link>
        <router-link to="/consultation" class="nav-link" v-if="isLogin">AI咨询</router-link>
        <router-link to="/emotiondiary" class="nav-link" v-if="isLogin">情绪日志</router-link>
        <router-link to="/knowledge" class="nav-link">知识库</router-link>
        <el-button class="logout-btn" v-if="isLogin">退出登录</el-button>
        <template v-else>
          <router-link to="/auth/login" class="nav-link">登录</router-link>
          <router-link to="/auth/register" class="nav-link">
            <el-button type="primary">注册</el-button>
          </router-link>
        </template>
      </div>
    </div>
    <div class="main-content">
      <router-view></router-view>
    </div>
    <div class="footer-container">
      <div class="footer-bottom">
        <p>© 2026 心理健康AI助手, All Rights Reserved.</p>
      </div>
    </div>
  </div>

</template>

<style lang="scss" scoped>
.frontend-layout {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, #f0f7ff 0%, #e6f7f5 100%);
  overflow-x: hidden;

  .navbar-container {
    height: 100%;
    padding: 12px 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #fff;

    .brand-section {
      display: flex;
      align-items: center;

      .brand-name {
        margin-left: 10px;
        font-size: 24px;
        font-weight: 600;
        color: #333;
      }
    }

    .nav-section {
      display: flex;
      align-items: center;
      gap: 40px;

      .nav-link {
        color: #4b5563;
        font-size: 16px;
        font-weight: 500;

        &:hover {
          color: #1296db;
        }
      }
    }
  }

  .footer-container {
    background: linear-gradient(135deg, #1a3a4a 0%, #0d2b36 100%);
    color: white;
    padding: 18px 0;
    margin-top: auto;

    .footer-bottom {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 10px;
      text-align: center;
    }
  }
}
</style>