<template>
  <el-card class="page-container">
    <template #header>
      <div class="header"><span>更换头像</span></div>
    </template>
    <el-upload
      class="avatar-uploader"
      action="/api/upload"
      :show-file-list="false"
      name="file"
      :headers="{'Authorization': token}"
      :on-success="handleSuccess"
    >
      <img v-if="imgUrl" :src="imgUrl" class="avatar" />
      <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
    </el-upload>
    <br/>
    <el-button type="primary" icon="Upload" size="large" @click="updateAvatar">确认更换</el-button>
  </el-card>
</template>

<script setup>
import { ref } from 'vue';
import request from '@/utils/request';
import { ElMessage } from 'element-plus';

const token = localStorage.getItem('token');
const imgUrl = ref('');

const handleSuccess = (res) => {
  imgUrl.value = res.data;
};

const updateAvatar = async () => {
  await request.patch(`/user/updateAvatar?avatarUrl=${imgUrl.value}`);
  ElMessage.success('头像更换成功');
  // 刷新页面以更新 Layout 中的头像
  location.reload(); 
};
</script>

<style scoped>
.avatar-uploader .avatar { width: 278px; height: 278px; display: block; }
.avatar-uploader .el-upload { border: 1px dashed var(--el-border-color); border-radius: 6px; cursor: pointer; position: relative; overflow: hidden; transition: var(--el-transition-duration-fast); }
.avatar-uploader .el-upload:hover { border-color: var(--el-color-primary); }
.el-icon.avatar-uploader-icon { font-size: 28px; color: #8c939d; width: 278px; height: 278px; text-align: center; }
</style>