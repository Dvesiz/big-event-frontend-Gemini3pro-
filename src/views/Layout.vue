<template>
  <el-container class="layout-container">
    <el-aside width="200px">
      <div class="logo">大事件后台</div>
      <el-menu
        active-text-color="#ffd04b"
        background-color="#232323"
        text-color="#fff"
        router
        :default-active="$route.path"
      >
        <el-menu-item index="/article/category">
          <el-icon><Management /></el-icon>
          <span>文章分类</span>
        </el-menu-item>
        <el-menu-item index="/article/manage">
          <el-icon><Promotion /></el-icon>
          <span>文章管理</span>
        </el-menu-item>
        <el-sub-menu index="/user">
          <template #title>
            <el-icon><UserFilled /></el-icon>
            <span>个人中心</span>
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
    <el-container>
      <el-header>
        <div class="header-content">
          <span>当前用户：<strong>{{ userInfo.nickname || userInfo.username }}</strong></span>
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              <el-avatar :size="32" :src="userInfo.userPic || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'" />
              <el-icon class="el-icon--right"><arrow-down /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="info">基本资料</el-dropdown-item>
                <el-dropdown-item command="avatar">更换头像</el-dropdown-item>
                <el-dropdown-item command="password">重置密码</el-dropdown-item>
                <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
      <el-footer>大事件管理系统 ©2025 Created by Gemini</el-footer>
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
.layout-container { height: 100vh; }
.el-aside { background-color: #232323; color: white; }
.logo { height: 60px; line-height: 60px; text-align: center; font-size: 20px; font-weight: bold; border-bottom: 1px solid #444; }
.el-header { background-color: #fff; display: flex; align-items: center; justify-content: flex-end; border-bottom: 1px solid #eee; }
.header-content { display: flex; align-items: center; gap: 15px; }
.el-footer { text-align: center; color: #999; line-height: 60px; font-size: 12px; }
</style>