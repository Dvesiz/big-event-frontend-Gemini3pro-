<template>
  <el-card class="page-container">
    <template #header>
      <div class="header"><span>重置密码</span></div>
    </template>
    <el-form :model="pwdData" :rules="rules" ref="formRef" label-width="100px" size="large">
      <el-form-item label="原密码" prop="old_Pwd">
        <el-input v-model="pwdData.old_Pwd" type="password"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="new_Pwd">
        <el-input v-model="pwdData.new_Pwd" type="password"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="confirm_Pwd">
        <el-input v-model="pwdData.confirm_Pwd" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="updatePwd">提交修改</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup>
import { reactive, ref } from 'vue';
import request from '@/utils/request';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';

const router = useRouter();
const pwdData = reactive({ old_Pwd: '', new_Pwd: '', confirm_Pwd: '' });
const formRef = ref();

const checkConfirm = (rule, value, callback) => {
  if (value !== pwdData.new_Pwd) callback(new Error('两次输入密码不一致'));
  else callback();
};

const rules = {
  old_Pwd: [{ required: true, message: '请输入原密码', trigger: 'blur' }],
  new_Pwd: [{ required: true, message: '请输入新密码', trigger: 'blur' }, { min: 5, max: 16, message: '长度在 5 到 16 个字符', trigger: 'blur' }],
  confirm_Pwd: [{ validator: checkConfirm, trigger: 'blur' }]
};

const updatePwd = async () => {
  await formRef.value.validate();
  await request.patch('/user/updatePwd', pwdData);
  ElMessage.success('密码修改成功，请重新登录');
  localStorage.removeItem('token');
  router.push('/login');
};
</script>