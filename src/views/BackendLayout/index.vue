<script setup>
import Sidebar from './components/Sidebar.vue';
import Navbar from './components/Navbar.vue';

</script>

<template>
   <div class="backend-layout">
    <el-container>
      <el-aside width="200px">
        <Sidebar></Sidebar>
      </el-aside>
      <el-container>
        <el-header>
          <Navbar></Navbar>
        </el-header>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style lang="scss" scoped>
.backend-layout{
  height: 100vh;

}
</style>