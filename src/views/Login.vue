<template>
  <div class="login-container">
    <div class="login-side">
      <div class="side-content">
        <div class="logo-box">
          <img src="@/assets/vue.svg" alt="Logo" class="logo-img" />
          <span class="logo-text">Big Event</span>
        </div>
        <div class="illustration">
          <h2>激发创作灵感 <br> 管理精彩生活</h2>
          <p>高效、安全、便捷的内容管理平台</p>
        </div>
      </div>
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
    </div>

    <div class="login-form-box">
      <div class="form-wrapper">
        <div class="form-header">
          <h3>{{ isRegister ? '创建账号' : '欢迎回来' }}</h3>
          <p>{{ isRegister ? '填写以下信息完成注册' : '请输入您的账号密码登录' }}</p>
        </div>

        <el-form v-if="isRegister" ref="form" :model="registerData" :rules="rules" size="large" class="custom-form">
          <el-form-item prop="username">
            <el-input v-model="registerData.username" placeholder="用户名" prefix-icon="User" />
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="registerData.password" type="password" placeholder="密码" prefix-icon="Lock" show-password />
          </el-form-item>
          <el-form-item prop="rePassword">
            <el-input v-model="registerData.rePassword" type="password" placeholder="确认密码" prefix-icon="Lock" show-password />
          </el-form-item>
          <el-button class="btn-submit" type="primary" :loading="loading" @click="register">立即注册</el-button>
          <div class="form-footer">
            <span>已有账号？</span>
            <span class="toggle-link" @click="isRegister = false">去登录</span>
          </div>
        </el-form>

        <el-form v-else ref="form" :model="loginData" :rules="rules" size="large" class="custom-form">
          <el-form-item prop="username">
            <el-input v-model="loginData.username" placeholder="请输入用户名" prefix-icon="User" />
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="loginData.password" type="password" placeholder="请输入密码" prefix-icon="Lock" show-password @keyup.enter="login"/>
          </el-form-item>
          
          <div class="flex-row">
             <el-checkbox v-model="rememberMe" label="记住我" />
             <span class="forgot-pwd" @click="handleForgetPassword">忘记密码?</span>
          </div>

          <el-button class="btn-submit" type="primary" :loading="loading" @click="login">登录</el-button>
          <div class="form-footer">
            <span>还没有账号？</span>
            <span class="toggle-link" @click="isRegister = true">去注册</span>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import request from '@/utils/request';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useRouter } from 'vue-router';

const router = useRouter();
const isRegister = ref(false);
const loading = ref(false); 
const rememberMe = ref(false); // 记住我状态
const REMEMBER_KEY = 'BIG_EVENT_REMEMBER_ME'; // LocalStorage 存储的 Key

const loginData = reactive({ username: '', password: '' });
const registerData = reactive({ username: '', password: '', rePassword: '' });

// 页面加载时检查是否有记住的密码
onMounted(() => {
  const stored = localStorage.getItem(REMEMBER_KEY);
  if (stored) {
    try {
      // Base64 解码 (注意：这不是真正的加密，仅作为简单的混淆)
      const decoded = JSON.parse(atob(stored));
      loginData.username = decoded.username;
      loginData.password = decoded.password;
      rememberMe.value = true;
    } catch (e) {
      console.error('读取记住的密码失败', e);
      localStorage.removeItem(REMEMBER_KEY);
    }
  }
});

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
  loading.value = true;
  try {
    let params = new URLSearchParams();
    params.append('username', registerData.username);
    params.append('password', registerData.password);
    await request.post('/user/register', params);
    ElMessage.success('注册成功，请登录');
    isRegister.value = false;
  } finally {
    loading.value = false;
  }
};

const login = async () => {
  loading.value = true;
  try {
    let params = new URLSearchParams();
    params.append('username', loginData.username);
    params.append('password', loginData.password);
    const res = await request.post('/user/login', params);
    
    // 登录成功逻辑
    localStorage.setItem('token', res.data);
    
    // 处理“记住我”逻辑
    if (rememberMe.value) {
      // 简单 Base64 编码存储
      const str = JSON.stringify({ username: loginData.username, password: loginData.password });
      localStorage.setItem(REMEMBER_KEY, btoa(str));
    } else {
      localStorage.removeItem(REMEMBER_KEY);
    }

    ElMessage.success('登录成功');
    router.push('/');
  } finally {
    loading.value = false;
  }
};

// 忘记密码处理函数
const handleForgetPassword = () => {
  ElMessageBox.alert('请联系系统管理员重置您的密码。<br/>管理员邮箱：admin@bigevent.com', '忘记密码', {
    dangerouslyUseHTMLString: true,
    confirmButtonText: '知道了',
    type: 'info'
  });
};
</script>

<style scoped>
.login-container {
  display: flex;
  height: 100vh;
  width: 100vw;
  background-color: #fff;
  overflow: hidden;
}

/* 左侧样式 */
.login-side {
  flex: 1;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #fff;
  overflow: hidden;
}

.side-content {
  z-index: 2;
  text-align: center;
}

.logo-box {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 40px;
}

.logo-img {
  width: 40px;
  height: 40px;
  margin-right: 15px;
}

.logo-text {
  font-size: 28px;
  font-weight: bold;
  letter-spacing: 2px;
}

.illustration h2 {
  font-size: 48px;
  line-height: 1.2;
  margin-bottom: 20px;
  font-weight: 800;
}

.illustration p {
  font-size: 18px;
  opacity: 0.8;
}

/* 装饰背景圆 */
.circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.circle-1 {
  width: 400px;
  height: 400px;
  top: -100px;
  left: -100px;
}

.circle-2 {
  width: 300px;
  height: 300px;
  bottom: -50px;
  right: -50px;
}

/* 右侧表单样式 */
.login-form-box {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
}

.form-wrapper {
  width: 100%;
  max-width: 420px;
  padding: 40px;
  animation: slideIn 0.5s ease-out;
}

@keyframes slideIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.form-header {
  margin-bottom: 40px;
}

.form-header h3 {
  font-size: 32px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 10px 0;
}

.form-header p {
  color: #6b7280;
  font-size: 14px;
}

.custom-form .el-input__wrapper {
  background-color: #f9fafb;
  box-shadow: none !important;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 10px 15px;
  transition: all 0.3s;
}

/* 深度选择器修改 input 聚焦样式 */
:deep(.el-input__wrapper.is-focus) {
  border-color: #4f46e5;
  background-color: #fff;
  box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1) !important;
}

.btn-submit {
  width: 100%;
  height: 48px;
  font-size: 16px;
  margin-top: 20px;
  border-radius: 8px;
  font-weight: 600;
  letter-spacing: 1px;
}

.flex-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.forgot-pwd {
  font-size: 14px;
  color: #4f46e5;
  cursor: pointer;
}

.form-footer {
  margin-top: 24px;
  text-align: center;
  font-size: 14px;
  color: #6b7280;
}

.toggle-link {
  color: #4f46e5;
  font-weight: 600;
  cursor: pointer;
  margin-left: 5px;
}

.toggle-link:hover {
  text-decoration: underline;
}

/* 响应式调整 */
@media (max-width: 900px) {
  .login-side {
    display: none;
  }
}
</style>