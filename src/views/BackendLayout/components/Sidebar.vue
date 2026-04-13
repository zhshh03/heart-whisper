<script setup>
import { useRouter } from 'vue-router';

const router = useRouter()
const iconUrl = new URL('@/assets/images/机器人.png',import.meta.url).href
console.log(router)
const backArr = router.options.routes[2].children

</script>
<template>
     <el-menu
        default-active="2"
        class="menu-style"
      >
      <div class="logo">
        <img :src="iconUrl" alt="">
        <div class="logo-text">
          <p class="title">心里健康助手</p>
          <p class="subtitle">管理后台</p>
        </div>
      </div>
        <el-menu-item 
            v-for="item in backArr" 
            :key="item.path" 
            :index="item.path" 
            @click="router.push(item.path)">
          <el-icon><component :is="item.meta.icon"/></el-icon>
          <span>{{ item.meta.title }}</span>
        </el-menu-item>

      </el-menu>
</template>

<style lang="scss" scoped>
.menu-style{
  height: 100%;
  background-color: #fff;

  .logo {
  display: flex;
  align-items: center;
  height: 74px;
  padding: 0 16px;
  border-bottom: 2px solid #eee;

  img {
    width: 50px;
    height: 50px;
    margin-right: 12px;
  }

  .logo-text {
    display: flex;
    flex-direction: column;
    justify-content: center;

    .title {
      font-size: 16px;
      font-weight: 600;
      color: #333;
      line-height: 1.4;
    }

    .subtitle {
      font-size: 12px;
      margin-top: 6px;
      color: #999;
      line-height: 1.4;
    }
  }
}
}


</style>