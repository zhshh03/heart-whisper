<script setup>
import PageHeader from './components/PageHearder.vue';
import CommonForm from '@/components/CommonForm.vue';
import { getCategory, getArticleListAPI } from '@/apis/admin'
import { onMounted, ref } from 'vue';

const title = '知识文章'
const formItem = [
  { comp: 'input', prop: 'title', label: '文章标题', placeholder: '请输入文章标题' },
  {
    comp: 'select', prop: 'category', label: '分类', placeholder: '选择分类'
  },
  {
    comp: 'select', prop: 'state', label: '状态', placeholder: '选择状态', options:
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

const pagination = ref({
  size: '10',
  currentPage: '1',
  authorName: ''
})

const tableData = ref([])

//查询
const handleSearch = async (formData) => {
  const data = await getArticleListAPI({
    ...formData,
    ...pagination.value
  })
  tableData.value = data.data.records
  console.log(tableData)
}

onMounted(() => {
  defaultSearch()
  handleSearch()
})
</script>


<template>
  <div>
    <PageHeader :title="title">
      <template #button>
        <el-button type="primary">新增</el-button>
      </template>
    </PageHeader>
    <CommonForm :formItem="formItem" @search="handleSearch"></CommonForm>
    <el-table :data="tableData" style="width: 100%; margin-top: 25px;">
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
  </div>
</template>