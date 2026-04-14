<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router'

const router = useRouter()

const formData = ref({
  username: '',
  password: ''
})
const rules = ref({
  username: [
    { required: true, message: '账户名不能为空', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '密码不能为空', trigger: 'blur' }
  ]
})
// "router.push('/back')"
const ruleFormRef = ref(null)

const handleLogin = (formEl) => {
  if (!formEl) return
  formEl.validate(async (valid, fields) => {
    if (valid) {
      // await goLogin(formData.value)
    } else {
      console.log('error submit!', fields)
    }
  })
}
</script>

<template>
  <div class="login-container">
    <div class="back">
      <el-icon :size="16">
        <Back />
      </el-icon>
      <p @click="router.push('/front')">返回首页</p>
    </div>
    <div class="title">
      <h2>登录您的账户</h2>
      <p>请输入您的登录信息</p>
    </div>
    <div class="login-form">
      <el-form ref="ruleFormRef" :model="formData" :rules="rules" label-position="top">
        <el-form-item label="用户名或者邮箱" prop="username">
          <el-input placeholder="请输入用户名或邮箱" size="large" v-model="formData.username" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input placeholder="请输入密码" size="large" v-model="formData.password" type="password" show-password />
        </el-form-item>
      </el-form>
    </div>
    <div class="go-login">
      <el-button type="primary" @click="handleLogin(ruleFormRef)">登录账户</el-button>
    </div>
    <div class="go-register">
      <p>还没有账号？<a href="" @click="router.push('/auth/register')">去注册</a></p>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  width: 100%;
  max-width: 400px;
  padding: 0 20px;
}

.back {
  display: flex;
  align-items: center;
  color: #000000;
  cursor: pointer;
  margin-bottom: 40px;
  font-size: 14px;
}

.back p {
  margin: 5px;
}

.back:hover {
  color: #333;
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

.login-form {
  margin-bottom: 20px;
}

.go-login :deep(.el-button) {
  width: 100%;
  height: 40px;
  padding: 12px 0;
  margin-top: 24px;
  font-size: 16px;
  color: #f4f2f2;
}

.go-register {
  margin-top: 16px;
  text-align: center;
  font-size: 14px;
  color: #000000;
}

.go-register a {
  color: #1297d9;
  text-decoration: none;
  font-weight: 500;
}

.go-register a:hover {
  text-decoration: underline;
}
</style>