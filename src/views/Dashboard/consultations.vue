<script setup>
import PageHeader from './components/PageHearder.vue';
import CommonForm from '@/components/CommonForm.vue';

const title = '咨询记录'
const formItem = [
  {
    comp: 'select', prop: 'category', label: '情绪标签', placeholder: '选择情绪', options: [
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
</script>


<template>
  <div>
    <PageHeader :title="title">
    </PageHeader>
    <CommonForm :formItem="formItem" @search="handleSearch"></CommonForm>
  </div>
</template>