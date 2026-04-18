<script setup>

const robotImg = new URL('@/assets/images/机器人.png', import.meta.url).href

</script>


<template>
  <div class="hero-section">
    <div class="hero-content">
      <div class="text-area">
        <h2 class="title-main">一次温暖的对话</h2>
        <h1 class="title-highlight">化孤独为慰藉</h1>
        <p class="description">
          每个深夜，每个焦虑的时刻，我们都在这里。不必独自承受，让心与心的连接温暖您的每一天
        </p>
        <div class="action-buttons">
          <el-button type="primary" class="btn-primary" size="large">开始倾诉，获得陪伴</el-button>
          <el-button class="btn-outline" size="large">记录心情，释放情感</el-button>
        </div>
      </div>
      <div class="image-area">
        <div class="robot-circle">
          <el-image :src="robotImg" alt="AI助手" class="robot-img" />
        </div>
      </div>
    </div>
  </div>
</template>


<style lang="scss" scoped>
.hero-section {
  width: 100%;
  min-height: calc(100vh - 140px);
  background: linear-gradient(135deg, #1296db 0%, #12b8a6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;

  .hero-content {
    max-width: 1100px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 60px;
  }

  .text-area {
    color: #fff;

    .title-main {
      font-size: 36px;
      font-weight: 500;
      margin-bottom: 8px;
      letter-spacing: 2px;
    }

    .title-highlight {
      font-size: 42px;
      font-weight: 700;
      color: #f5d76e;
      margin-bottom: 24px;
      letter-spacing: 3px;
    }

    .description {
      font-size: 16px;
      line-height: 1.8;
      opacity: 0.9;
      max-width: 480px;
      margin-bottom: 36px;
    }
  }

  .image-area {
    flex-shrink: 0;

    .robot-circle {
      width: 280px;
      height: 280px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.12);
      border: 2px solid rgba(255, 255, 255, 0.25);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);

      .robot-img {
        width: 160px;
        height: 160px;
        filter: brightness(0) invert(1);
        opacity: 0.95;
      }
    }
  }

  .action-buttons {
    display: flex;
    gap: 16px;

    .btn-primary {
      background-color: #fff;
      color: #1296db;
      border-color: #fff;
      font-size: 15px;
      padding: 12px 28px;
      border-radius: 6px;
      font-weight: 500;

      &:hover {
        background-color: #f0f0f0;
        color: #1296db;
        border-color: #f0f0f0;
      }
    }

    .btn-outline {
      background-color: transparent;
      color: #fff;
      border-color: rgba(255, 255, 255, 0.6);
      font-size: 15px;
      padding: 12px 28px;
      border-radius: 6px;
      font-weight: 500;

      &:hover {
        background-color: rgba(255, 255, 255, 0.12);
        color: #fff;
        border-color: #fff;
      }
    }
  }
}
</style>
