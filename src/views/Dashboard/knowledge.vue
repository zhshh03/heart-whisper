<script setup>
import PageHeader from './components/PageHearder.vue';
import CommonForm from '@/components/CommonForm.vue';

const title = '知识文章'
const formItem = [
  { comp: 'input', prop: 'title', label: '文章标题', placeholder: '请输入文章标题' },
  {
    comp: 'select', prop: 'category', label: '分类', placeholder: '选择分类', options: [
      {
        label: '分类一',
        value: '1'
      },
      {
        label: '分类二',
        value: '2'
      }
    ]
  },
  {
    comp: 'select', prop: 'state', label: '状态', placeholder: '选择状态', options: [
      {
        label: '分类一',
        value: '1'
      },
      {
        label: '分类二',
        value: '2'
      }
    ]
  }
]

const handleSearch = (formData) => {
  console.log(formData)
}
</script>


<template>
  <div>
    <PageHeader :title="title">
      <template #button>
        <el-button type="primary">新增</el-button>
      </template>
    </PageHeader>
    <CommonForm :formItem="formItem" @search="handleSearch"></CommonForm>
  </div>
</template>