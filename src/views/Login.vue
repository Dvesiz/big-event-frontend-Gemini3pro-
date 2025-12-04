<template>
  <div class="login-page">
    <div class="bg-overlay"></div>
    <div class="form-box">
      <div class="header">
        <h1>大事件管理系统</h1>
      </div>
      <el-form v-if="isRegister" ref="form" :model="registerData" :rules="rules" size="large">
        <el-form-item prop="username">
          <el-input v-model="registerData.username" placeholder="请输入用户名" prefix-icon="User" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="registerData.password" type="password" placeholder="请输入密码" prefix-icon="Lock" />
        </el-form-item>
        <el-form-item prop="rePassword">
          <el-input v-model="registerData.rePassword" type="password" placeholder="请再次输入密码" prefix-icon="Lock" />
        </el-form-item>
        <el-button class="btn-full" type="primary" @click="register">注册</el-button>
        <div class="link">
          <el-link type="info" @click="isRegister = false">已有账号？去登录</el-link>
        </div>
      </el-form>

      <el-form v-else ref="form" :model="loginData" :rules="rules" size="large">
        <el-form-item prop="username">
          <el-input v-model="loginData.username" placeholder="请输入用户名" prefix-icon="User" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginData.password" type="password" placeholder="请输入密码" prefix-icon="Lock" />
        </el-form-item>
        <el-button class="btn-full" type="primary" @click="login">登录</el-button>
        <div class="link">
          <el-link type="info" @click="isRegister = true">注册新账号</el-link>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import request from '@/utils/request';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';

const router = useRouter();
const isRegister = ref(false);

const loginData = reactive({ username: '', password: '' });
const registerData = reactive({ username: '', password: '', rePassword: '' });

const validatePass2 = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请再次输入密码'));
  } else if (value !== registerData.password) {
    callback(new Error('两次输入密码不一致!'));
  } else {
    callback();
  }
};

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 5, max: 16, message: '长度在 5 到 16 个字符', trigger: 'blur' },
    { pattern: /^\S+$/, message: '用户名不能包含空格', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 5, max: 16, message: '长度在 5 到 16 个字符', trigger: 'blur' },
    { pattern: /^\S+$/, message: '密码不能包含空格', trigger: 'blur' }
  ],
  rePassword: [{ validator: validatePass2, trigger: 'blur' }]
};

const register = async () => {
  let params = new URLSearchParams();
  params.append('username', registerData.username);
  params.append('password', registerData.password);
  await request.post('/user/register', params);
  ElMessage.success('注册成功，请登录');
  isRegister.value = false;
};

const login = async () => {
  let params = new URLSearchParams();
  params.append('username', loginData.username);
  params.append('password', loginData.password);
  const res = await request.post('/user/login', params);
  localStorage.setItem('token', res.data);
  ElMessage.success('登录成功');
  router.push('/');
};
</script>

<style scoped>
.login-page {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
.form-box {
  background: white;
  padding: 40px;
  border-radius: 10px;
  width: 400px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
}
.header h1 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}
.btn-full {
  width: 100%;
}
.link {
  text-align: right;
  margin-top: 10px;
}
</style>