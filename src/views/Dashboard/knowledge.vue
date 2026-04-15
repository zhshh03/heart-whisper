<script setup>
import PageHeader from './components/PageHearder.vue';
import CommonForm from '@/components/CommonForm.vue';
import { getCategory, getArticleListAPI } from '@/apis/admin'
import { onMounted, ref } from 'vue';
import ArticleDialog from './components/ArticleDialog.vue';

const title = '知识文章'
const formItem = [
  { comp: 'input', prop: 'title', label: '文章标题', placeholder: '请输入文章标题' },
  {
    comp: 'select', prop: 'categoryId', label: '分类', placeholder: '选择分类'
  },
  {
    comp: 'select', prop: 'status', label: '状态', placeholder: '选择状态', options:
      [
        {
          label: '草稿',
          value: '0'
        },
        {
          label: '已发布',
          value: '1'
        },
        {
          label: '已上线',
          value: '2'
        },
      ]
  }
]

//存放分类下拉菜单key、value
const categories = ref([])
//暂时未知
const categoryMap = ref({})

//默认数据
const defaultSearch = async () => {
  const res = await getCategory()
  //获取分类菜单列表
  categories.value = res.data.map(itme => {
    categoryMap.value[itme.id] = itme.categoryName
    return {
      label: itme.categoryName,
      value: itme.id
    }
  })
  formItem[1].options = categories.value
}
//分页数据
const pagination = ref({
  size: 8,
  currentPage: 1,
  authorName: ''
})
//表格数据及总条数
const tableData = ref([])
const total = ref()

//查询
const handleSearch = async (formData) => {
  const data = await getArticleListAPI({
    ...formData,
    ...pagination.value
  })
  tableData.value = data.data.records
  total.value = data.data.total
}
//分页改变
const handleChange = (page) => {
  pagination.value.currentPage = page
  handleSearch()
}
const dialogVisible = ref(false)

onMounted(() => {
  defaultSearch()
  handleSearch()
})
</script>


<template>
  <div>
    <PageHeader :title="title">
      <template #button>
        <el-button plain type="primary" @click="dialogVisible = true">新增</el-button>
      </template>
    </PageHeader>
    <CommonForm :formItem="formItem" @search="handleSearch"></CommonForm>
    <el-table
      :header-row-style="() => ({ backgroundColor: '#f5f7fa', color: '#303133', fontWeight: '600', fontSize: '14px', height: '45px' })"
      :data="tableData" style="width: 100%; margin-top: 25px;">
      <el-table-column label="文章标题" width="400" fixed="left">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <el-icon>
              <timer />
            </el-icon>
            <span style="margin-left: 10px">{{ scope.row.title }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="分类" width="200">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <el-icon>
              <timer />
            </el-icon>
            <span style="margin-left: 10px">{{ scope.row.categoryName }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="作者" prop="authorName" width="150"></el-table-column>
      <el-table-column label="阅读量" prop="readCount" width="150"></el-table-column>
      <el-table-column label="发布时间" prop="updatedAt" width="150"></el-table-column>
      <el-table-column label="操作" width="240" fixed="right">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <el-button text type="primary">编辑</el-button>
            <el-button v-if="scope.row.status === 0 || scope.row.status === 2" text type="success">发布</el-button>
            <el-button v-if="scope.row.status === 1" text type="warning">下线</el-button>
            <el-button text type="danger">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background style="margin-top: 25px;" layout="prev, pager, next" :total="total"
      :page-size="pagination.size" @current-change="handleChange" />
    <ArticleDialog v-model:modelValue="dialogVisible" :categories="categories" @success="handleSearch"></ArticleDialog>
  </div>
</template>