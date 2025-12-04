<template>
  <el-card class="page-container">
    <template #header>
      <div class="header"><span>基本资料</span></div>
    </template>
    <el-form :model="userInfo" :rules="rules" ref="formRef" label-width="100px" size="large">
      <el-form-item label="登录名称">
        <el-input v-model="userInfo.username" disabled></el-input>
      </el-form-item>
      <el-form-item label="用户昵称" prop="nickname">
        <el-input v-model="userInfo.nickname"></el-input>
      </el-form-item>
      <el-form-item label="用户邮箱" prop="email">
        <el-input v-model="userInfo.email"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="updateUserInfo">提交修改</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import request from '@/utils/request';
import { ElMessage } from 'element-plus';

const userInfo = ref({});
const formRef = ref();
const rules = {
  nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }, { pattern: /^\S{1,10}$/, message: '昵称1-10位非空字符', trigger: 'blur' }],
  email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }, { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }]
};

const getUserInfo = async () => {
  const res = await request.get('/user/userinfo');
  userInfo.value = res.data;
};

const updateUserInfo = async () => {
  await formRef.value.validate();
  await request.put('/user/update', userInfo.value);
  ElMessage.success('修改成功');
};

onMounted(getUserInfo);
</script>