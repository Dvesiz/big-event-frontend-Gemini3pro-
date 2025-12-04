<template>
  <el-container class="layout-container">
    <el-aside width="240px" class="aside-menu">
      <div class="logo">
        <img src="@/assets/vue.svg" alt="logo" class="logo-icon" />
        <span class="logo-text">大事件后台</span>
      </div>
      <el-menu
        active-text-color="#fff"
        background-color="#1f2937"
        text-color="#9ca3af"
        router
        :default-active="$route.path"
        class="el-menu-vertical"
      >
        <el-menu-item index="/article/category">
          <el-icon><Management /></el-icon>
          <span>文章分类</span>
        </el-menu-item>
        <el-menu-item index="/article/manage">
          <el-icon><Promotion /></el-icon>
          <span>文章管理</span>
        </el-menu-item>
        
        <div class="menu-divider">个人中心</div>

        <el-sub-menu index="/user">
          <template #title>
            <el-icon><UserFilled /></el-icon>
            <span>个人设置</span>
          </template>
          <el-menu-item index="/user/info">
            <el-icon><User /></el-icon>
            <span>基本资料</span>
          </el-menu-item>
          <el-menu-item index="/user/avatar">
            <el-icon><Crop /></el-icon>
            <span>更换头像</span>
          </el-menu-item>
          <el-menu-item index="/user/password">
            <el-icon><EditPen /></el-icon>
            <span>重置密码</span>
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-aside>

    <el-container class="main-content-wrapper">
      <el-header class="top-header">
        <div class="breadcrumb">
          <span class="page-title">{{ $route.meta.title || '工作台' }}</span>
        </div>
        <div class="header-right">
          <span class="user-greeting">你好, <strong>{{ userInfo.nickname || userInfo.username }}</strong></span>
          <el-dropdown @command="handleCommand" trigger="click">
            <span class="el-dropdown-link">
              <el-avatar 
                :size="40" 
                :src="userInfo.userPic || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'" 
                class="user-avatar"
              />
              <el-icon class="el-icon--right"><arrow-down /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu class="custom-dropdown">
                <el-dropdown-item command="info">
                  <el-icon><User /></el-icon>基本资料
                </el-dropdown-item>
                <el-dropdown-item command="avatar">
                   <el-icon><Crop /></el-icon>更换头像
                </el-dropdown-item>
                <el-dropdown-item command="password">
                   <el-icon><Key /></el-icon>重置密码
                </el-dropdown-item>
                <el-dropdown-item command="logout" divided class="logout-item">
                   <el-icon><SwitchButton /></el-icon>退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <el-main class="main-body">
        <router-view v-slot="{ Component }">
          <transition name="fade-slide" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </el-main>

      <el-footer class="main-footer">Big Event System ©2025 Created by Gemini</el-footer>
    </el-container>
  </el-container>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import request from '@/utils/request';
import { ElMessageBox, ElMessage } from 'element-plus';

const router = useRouter();
const userInfo = ref({});

const getUserInfo = async () => {
  const res = await request.get('/user/userinfo');
  userInfo.value = res.data;
};

const handleCommand = (command) => {
  if (command === 'logout') {
    ElMessageBox.confirm('确认退出吗?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(() => {
      localStorage.removeItem('token');
      router.push('/login');
      ElMessage.success('已退出登录');
    });
  } else {
    router.push('/user/' + command);
  }
};

onMounted(() => {
  getUserInfo();
});
</script>

<style scoped>
.layout-container {
  height: 100vh;
}

/* 侧边栏样式 */
.aside-menu {
  background-color: #1f2937;
  color: white;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 8px rgba(0,0,0,0.1);
  z-index: 10;
}

.logo {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: bold;
  color: #fff;
  background-color: #111827; /* 比菜单稍深一点 */
}

.logo-icon {
  width: 24px;
  height: 24px;
  margin-right: 10px;
}

.el-menu-vertical {
  border-right: none;
  flex: 1;
}

.menu-divider {
  padding: 20px 0 10px 20px;
  font-size: 12px;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* 覆盖菜单选中样式 */
:deep(.el-menu-item.is-active) {
  background-color: var(--el-color-primary) !important;
  color: #fff !important;
  border-right: 3px solid #a5b4fc;
}

:deep(.el-menu-item:hover) {
  background-color: #374151 !important;
}

/* 头部样式 */
.top-header {
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30px;
  box-shadow: 0 1px 4px rgba(0,21,41,0.08);
  height: 64px;
  z-index: 9;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 15px;
}

.user-greeting {
  font-size: 14px;
  color: #374151;
}

.user-avatar {
  border: 2px solid #e5e7eb;
  cursor: pointer;
  transition: all 0.3s;
}

.user-avatar:hover {
  border-color: var(--el-color-primary);
}

.el-dropdown-link {
  display: flex;
  align-items: center;
  outline: none;
}

/* 内容区域 */
.main-content-wrapper {
  background-color: #f3f4f6; /* 浅灰背景 */
}

.main-body {
  padding: 24px;
  overflow-y: auto;
}

.main-footer {
  text-align: center;
  color: #9ca3af;
  line-height: 50px;
  height: 50px;
  font-size: 12px;
}

/* 页面切换动画 */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>