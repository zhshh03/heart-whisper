<script setup>
import Sidebar from './components/Sidebar.vue';
import Navbar from './components/Navbar.vue';

</script>

<template>
   <div class="backend-layout">
    <el-container class="main-container">
      <el-aside width="264px">
        <Sidebar></Sidebar>
      </el-aside>
      <el-container>
        <el-header class="el-header">
          <Navbar></Navbar>
        </el-header>
        <el-main>
          <router-view class="content-container"></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style lang="scss" scoped>
.backend-layout{
  height: 100vh;

  .main-container{
    height: 100%;

    .el-header{
      height: 74px !important
    }

    .content-container {
      padding: 20px;
      background-color: #f4f4f4;
      min-height: calc(100% - 74px);
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
      border-radius: 8px;
    }
  }
}
</style>