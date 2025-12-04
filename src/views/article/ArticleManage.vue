<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span>文章管理</span>
        <div class="btns">
          <el-button type="primary" @click="openDrawer()">发布文章</el-button>
        </div>
      </div>
    </template>
    <el-form inline>
      <el-form-item label="文章分类：">
        <el-select v-model="searchParams.categoryId" placeholder="请选择" style="width: 150px">
          <el-option v-for="c in categories" :key="c.id" :label="c.categoryName" :value="c.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="发布状态：">
        <el-select v-model="searchParams.state" placeholder="请选择" style="width: 150px">
          <el-option label="已发布" value="已发布"></el-option>
          <el-option label="草稿" value="草稿"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getArticles">搜索</el-button>
        <el-button @click="resetSearch">重置</el-button>
      </el-form-item>
    </el-form>
    
    <el-table :data="articles" style="width: 100%">
      <el-table-column label="文章标题" prop="title"></el-table-column>
      <el-table-column label="分类" prop="categoryId">
        <template #default="{ row }">
          {{ categories.find(c => c.id === row.categoryId)?.categoryName || '未知' }}
        </template>
      </el-table-column>
      <el-table-column label="发布时间" prop="createTime">
        <template #default="{ row }">
          {{ row.createTime.replace('T', ' ') }}
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="state"></el-table-column>
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button type="primary" icon="Edit" circle size="small" @click="openDrawer(row)"></el-button>
          <el-button type="danger" icon="Delete" circle size="small" @click="deleteArticle(row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <el-pagination
      v-model:current-page="searchParams.pageNum"
      v-model:page-size="searchParams.pageSize"
      :page-sizes="[5, 10, 20]"
      layout="jumper, total, sizes, prev, pager, next"
      :total="total"
      @size-change="getArticles"
      @current-change="getArticles"
      style="margin-top: 20px; justify-content: flex-end"
    />

    <el-drawer v-model="drawerVisible" :title="articleModel.id ? '编辑文章' : '发布文章'" size="50%">
      <el-form :model="articleModel" label-width="100px">
        <el-form-item label="文章标题">
          <el-input v-model="articleModel.title" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="文章分类">
          <el-select v-model="articleModel.categoryId" placeholder="请选择分类" style="width:100%">
            <el-option v-for="c in categories" :key="c.id" :label="c.categoryName" :value="c.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="文章封面">
          <el-upload
            class="avatar-uploader"
            :show-file-list="false"
            action="/api/upload"
            name="file"
            :headers="{'Authorization': token}"
            :on-success="handleUploadSuccess"
          >
            <img v-if="articleModel.coverImg" :src="articleModel.coverImg" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="文章内容">
            <el-input type="textarea" :rows="8" v-model="articleModel.content" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveArticle('已发布')">发布</el-button>
          <el-button type="info" @click="saveArticle('草稿')">草稿</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
  </el-card>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import request from '@/utils/request';
import { ElMessage, ElMessageBox } from 'element-plus';

const articles = ref([]);
const categories = ref([]);
const total = ref(0);
const drawerVisible = ref(false);
const token = localStorage.getItem('token');
const searchParams = reactive({ pageNum: 1, pageSize: 5, categoryId: '', state: '' });
const articleModel = ref({ title: '', categoryId: '', coverImg: '', content: '', state: '' });

const getCategories = async () => {
  const res = await request.get('/category/list');
  categories.value = res.data;
};

const getArticles = async () => {
  let params = { ...searchParams };
  if (!params.categoryId) delete params.categoryId;
  if (!params.state) delete params.state;
  const res = await request.get('/article/listsearch', { params });
  articles.value = res.data.items;
  total.value = res.data.total;
};

const resetSearch = () => {
  searchParams.categoryId = '';
  searchParams.state = '';
  getArticles();
};

const openDrawer = (row) => {
  drawerVisible.value = true;
  if (row) {
    articleModel.value = { ...row };
  } else {
    articleModel.value = { title: '', categoryId: '', coverImg: '', content: '', state: '' };
  }
};

const handleUploadSuccess = (res) => {
  articleModel.value.coverImg = res.data;
};

const saveArticle = async (state) => {
  articleModel.value.state = state;
  if (articleModel.value.id) {
    await request.put('/article/update', articleModel.value);
    ElMessage.success('修改成功');
  } else {
    await request.post('/article/add', articleModel.value);
    ElMessage.success('发布成功');
  }
  drawerVisible.value = false;
  getArticles();
};

const deleteArticle = (row) => {
  ElMessageBox.confirm('确认删除?', '提示', { type: 'warning' }).then(async () => {
    await request.delete(`/article/delete?id=${row.id}`);
    ElMessage.success('删除成功');
    getArticles();
  });
};

onMounted(() => {
  getCategories();
  getArticles();
});
</script>

<style scoped>
.header { display: flex; justify-content: space-between; align-items: center; }
.avatar-uploader .avatar { width: 178px; height: 178px; display: block; }
.avatar-uploader .el-upload { border: 1px dashed var(--el-border-color); border-radius: 6px; cursor: pointer; position: relative; overflow: hidden; transition: var(--el-transition-duration-fast); }
.avatar-uploader .el-upload:hover { border-color: var(--el-color-primary); }
.el-icon.avatar-uploader-icon { font-size: 28px; color: #8c939d; width: 178px; height: 178px; text-align: center; }
</style>