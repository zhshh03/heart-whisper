<script setup>
const url = new URL('@/assets/images/robot-fill.png', import.meta.url).href

</script>

<template>
  <div class="layout">
    <div class="right-sidebar">
      <h2 class="title">心里AI助手</h2>
      <p class="desc">每个深夜，每个焦虑的时刻，我们都在这里。不必独自承受，让心与心的连接温暖您的每一天</p>
      <div class="img-box">
        <el-image :src="url" style="width: 90px; height: 90px;"></el-image>
      </div>
    </div>
    <div class="left-sidebar">
      <router-view></router-view>
    </div>
  </div>

</template>

<style lang="scss" scoped>
.layout {
  display: flex;
  width: 100vw;
  height: 100vh;
}

.right-sidebar {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1296db 0%, #12b8a6 100%);
  color: #fff;
  padding: 40px;
}

.left-sidebar {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.title {
  font-size: 32px;
  margin-bottom: 16px;
}

.img-box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 160px;
  height: 160px;
  border-radius: 50px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.3)
}

.desc {
  font-size: 16px;
  text-align: center;
  max-width: 360px;
  line-height: 1.6;
  margin-bottom: 40px;
  opacity: 0.8;
}
</style>