<script setup>
import { Expand } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { useAdminStore } from '@/stores/admin'

const adminStore = useAdminStore()

const router = useRouter()
const handleCommand = (command) => {
  if (command === 'logout') {
    router.push('/auth/login')
  }else {
    console.log('个人中心')
  }
}
const handleExpand = () => {
  adminStore.toggleCollapse()
}
</script>

<template>
    <div class="navbar">
        <div class="flex-box">
            <el-button @click="handleExpand" :icon="Expand" />
            <p class="title">导航栏</p>
        </div>
        <div class="flex-box">
            <el-avatar
        src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
      />
        <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
                admin
            <el-icon class="el-icon--right">
                <arrow-down />
            </el-icon>
            </span>
            <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item command="enter">个人中心</el-dropdown-item>
                    <el-dropdown-item command="logout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
            </template>
        </el-dropdown>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.navbar {
  display: flex;
  height: 100%;
  align-items: center;
  padding: 0 25px 0 15px;
  background: #fff;
  justify-content: space-between;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  border-bottom: 1px solid #eee;

  .flex-box{
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .title {
    margin-left: 20px;
    font-size: 26px;
    font-weight: bold;
    color: #333;
  }

  .example-showcase .el-dropdown-link {
    cursor: pointer;
    color: var(--el-color-primary);
    display: flex;
    align-items: center;
}
}
</style>