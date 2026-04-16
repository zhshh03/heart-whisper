<script setup>
import { useRouter, useRoute } from 'vue-router';
import { useAdminLayoutStore } from '@/stores/Admin/adminLayout'
import { computed } from 'vue';

const adminLayoutStore = useAdminLayoutStore()
const isCollapse = computed(() => adminLayoutStore.isCollapse)

const router = useRouter()
const route = useRoute()
const iconUrl = new URL('@/assets/images/机器人.png', import.meta.url).href
const backArr = router.options.routes[2].children

const handleClick = (item) => {
  router.push(item.path)
}

</script>
<template>
  <el-menu :default-active="route.path" :collapse="isCollapse" :collapse-transition="false" class="menu-style">
    <div :class="['logo', { collapsed: isCollapse }]">
      <img :src="iconUrl" alt="">
      <div v-show="!isCollapse" class="logo-text">
        <p class="title">心里健康助手</p>
        <p class="subtitle">管理后台</p>
      </div>
    </div>
    <el-menu-item v-for="item in backArr" :key="item.path" :index="item.path" @click="handleClick(item)">
      <el-icon>
        <component :is="item.meta.icon" />
      </el-icon>
      <span>{{ item.meta.title }}</span>
    </el-menu-item>

  </el-menu>
</template>

<style lang="scss" scoped>
.menu-style {
  height: 100%;
  background-color: #fff;

  .logo {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    height: 74px;
    padding: 0 16px;
    border-bottom: 2px solid #eee;

    &.collapsed {
      justify-content: center;
    }

    img {
      width: 50px;
      height: 50px;
    }

    .logo-text {
      display: flex;
      flex-direction: column;
      justify-content: center;
      margin-left: 12px;

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