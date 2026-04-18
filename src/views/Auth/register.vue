<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { registerAPI } from '@/apis/userInfo'
import { ElMessage } from 'element-plus'

const router = useRouter()

const formData = ref({
  username: '',
  email: '',
  nickname: '',
  phone: '',
  password: '',
  confirmPassword: '',
  gender: 1,
  userType: 1
})

const rules = ref({
  username: [{ required: true, message: '请输入用户名或邮箱', trigger: 'blur' }],
  email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  confirmPassword: [{ required: true, message: '请再次输入密码', trigger: 'blur' }]
})

const submitFormRef = ref(null)

const submitForm = async (submitFormRef) => {
  if (!submitFormRef) return
  submitFormRef.validate(async (valid) => {
    if (valid) {
      try {
        await registerAPI(formData.value)
        ElMessage.success('注册成功')
        router.push('/auth/login')
      } catch {
        // 注册失败已在http拦截器中提示错误信息
      }
    } else {
      return false
    }
  })
}
</script>

<template>
  <div class="register-container">
    <div class="title">
      <h2>创建您的账户</h2>
      <p>请填写注册信息</p>
    </div>
    <div class="register-form">
      <el-form :model="formData" label-position="top" :rules="rules" ref="submitFormRef">
        <el-form-item label="用户名或邮箱" prop="username">
          <el-input v-model="formData.username" placeholder="请输入用户名或邮箱" size="large" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="formData.email" placeholder="请输入邮箱" size="large" />
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="formData.nickname" placeholder="请输入昵称（可选）" size="large" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="formData.phone" placeholder="请输入手机号（可选）" size="large" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="formData.password" type="password" show-password placeholder="请输入密码" size="large" />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="formData.confirmPassword" type="password" show-password placeholder="请再次输入密码"
            size="large" />
        </el-form-item>
      </el-form>
    </div>
    <div class="submit-btn">
      <el-button type="primary" size="large" @click="submitForm(submitFormRef)">创建用户</el-button>
    </div>
    <div class="go-login">
      <p>已有账户？<a href="" @click.prevent="router.push('/auth/login')">立即登录</a></p>
    </div>
  </div>
</template>

<style scoped>
.register-container {
  width: 100%;
  max-width: 420px;
  padding: 0 20px;
}

.title {
  margin-bottom: 32px;
  text-align: center;
}

.title h2 {
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin: 0 0 8px 0;
}

.title p {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.register-form {
  margin-bottom: 4px;

  :deep(.el-form-item__label) {
    color: #333;
    font-size: 14px;
    padding-bottom: 4px;
  }

  :deep(.el-form-item__label::before) {
    color: #f56c6c;
  }
}

.submit-btn :deep(.el-button) {
  width: 100%;
  height: 44px;
  margin-top: 8px;
  font-size: 16px;
  border-radius: 6px;
}

.go-login {
  margin-top: 20px;
  text-align: center;
  font-size: 14px;
  color: #666;
}

.go-login a {
  color: #1297d9;
  text-decoration: none;
  font-weight: 500;
}

.go-login a:hover {
  text-decoration: underline;
}
</style>