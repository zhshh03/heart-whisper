<script setup>
import PageHeader from './components/PageHearder.vue';

const title = '知识文章'
</script>


<template>
  <div>
    <PageHeader :title="title">
      <template #button>
        <el-button  type="primary">新增</el-button>
      </template>
    </PageHeader>
  </div>
</template>