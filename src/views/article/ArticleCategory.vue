<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span>文章分类</span>
        <el-button type="primary" @click="openDialog()">添加分类</el-button>
      </div>
    </template>
    <el-table :data="categories" style="width: 100%">
      <el-table-column label="序号" width="100" type="index"></el-table-column>
      <el-table-column label="分类名称" prop="categoryName"></el-table-column>
      <el-table-column label="分类别名" prop="categoryAlias"></el-table-column>
      <el-table-column label="操作" width="150">
        <template #default="{ row }">
          <el-button type="primary" icon="Edit" circle size="small" @click="openDialog(row)"></el-button>
          <el-button type="danger" icon="Delete" circle size="small" @click="deleteCategory(row)"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" :title="title" width="30%">
      <el-form :model="categoryModel" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="分类名称" prop="categoryName">
          <el-input v-model="categoryModel.categoryName" placeholder="请输入分类名称"></el-input>
        </el-form-item>
        <el-form-item label="分类别名" prop="categoryAlias">
          <el-input v-model="categoryModel.categoryAlias" placeholder="请输入分类别名"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveCategory"> 确认 </el-button>
        </span>
      </template>
    </el-dialog>
  </el-card>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import request from '@/utils/request';
import { ElMessage, ElMessageBox } from 'element-plus';

const categories = ref([]);
const dialogVisible = ref(false);
const title = ref('');
const categoryModel = ref({ categoryName: '', categoryAlias: '' });
const formRef = ref();

const rules = {
  categoryName: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
  categoryAlias: [{ required: true, message: '请输入分类别名', trigger: 'blur' }]
};

const getCategories = async () => {
  const res = await request.get('/category/list');
  categories.value = res.data;
};

const openDialog = (row) => {
  dialogVisible.value = true;
  title.value = row ? '编辑分类' : '添加分类';
  categoryModel.value = row ? { ...row } : { categoryName: '', categoryAlias: '' };
};

const saveCategory = async () => {
  await formRef.value.validate();
  if (categoryModel.value.id) {
    await request.put('/category/update', categoryModel.value);
    ElMessage.success('修改成功');
  } else {
    await request.post('/category/add', categoryModel.value);
    ElMessage.success('添加成功');
  }
  dialogVisible.value = false;
  getCategories();
};

const deleteCategory = (row) => {
  ElMessageBox.confirm('确认删除该分类吗?', '警告', { type: 'warning' }).then(async () => {
    await request.delete(`/category/delete?id=${row.id}`);
    ElMessage.success('删除成功');
    getCategories();
  });
};

onMounted(getCategories);
</script>

<style scoped>
.header { display: flex; justify-content: space-between; align-items: center; }
</style>