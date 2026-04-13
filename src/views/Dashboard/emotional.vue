<script setup>
import PageHeader from './components/PageHearder.vue';
import CommonForm from '@/components/CommonForm.vue';

const title = '情绪日志'
const formItem = [
  { comp: 'input', prop: 'title', label: '用户ID', placeholder: '请输入用户ID' },
  {
    comp: 'select', prop: 'category', label: '分类', placeholder: '选择情绪', options: [
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
    comp: 'select', prop: 'state', label: '情绪评分', placeholder: '选择评分范围', options: [
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
    </PageHeader>
    <CommonForm :formItem="formItem" @search="handleSearch"></CommonForm>
  </div>
</template>