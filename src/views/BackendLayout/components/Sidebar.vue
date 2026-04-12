<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();
const handleClose = () => {
}
const handleOpen = () => {
}

console.log(router)
const backArr = router.options.routes[2].children

</script>
<template>
     <el-menu
        default-active="2"
        class="el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose"
      >
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

</style>