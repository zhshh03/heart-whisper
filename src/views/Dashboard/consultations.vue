<script setup>
import { ref, onMounted } from 'vue';
import PageHeader from './components/PageHearder.vue';
import { getConsultationListAPI } from '@/apis/adminConsultations'

const title = '咨询记录'

const tableData = ref([])

const pagination = ref({
  size: 10,
  currentPage: 1,
  emotionTag: ''
})

const total = ref(0)

const getConsultationsList = async (params) => {
  const res = await getConsultationListAPI(params.value)
  tableData.value = res.data.records
  total.value = res.data.total
  console.log(tableData)
}

const handleChange = (page) => {
  pagination.value.currentPage = page
  getConsultationsList(pagination)
}

// const viewDetails = (row) => {

// }

onMounted(() => {
  getConsultationsList(pagination)
})
</script>


<template>
  <div>
    <PageHeader :title="title">
    </PageHeader>
    <el-table
      :header-row-style="() => ({ backgroundColor: '#f5f7fa', color: '#303133', fontWeight: '600', fontSize: '14px', height: '45px' })"
      :data="tableData" class="consultation-table">
      <el-table-column label="会话ID" width="100" align="center">
        <template #default="scope">
          <el-avatar :size="40">{{ scope.row.userNickname }}</el-avatar>
        </template>
      </el-table-column>
      <el-table-column label="情绪标签">
        <template #default="scope">
          <div class="session-title">{{ scope.row.sessionTitle }}</div>
          <div class="session-preview">{{ scope.row.lastMessageContent }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="messageCount" label="消息数" width="120" align="center" />
      <el-table-column prop="startedAt" label="时间" width="120" />
      <el-table-column label="操作" width="100" align="center">
        <template #default="scope">
          <el-button type="text" @click="viewDetails(scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination :current-page="pagination.currentPage" background class="pagination" layout="prev, pager, next"
      :total="total" :page-size="pagination.size" @current-change="handleChange" />
  </div>
</template>

<style scoped>
.consultation-table {
  width: 100%;
  margin-top: 25px;
}

.session-title {
  font-weight: 700;
  font-size: 14px;
  color: #333;
}

.session-preview {
  font-size: 13px;
  color: #909399;
  margin-top: 6px;
  text-indent: 1em;
}

.pagination {
  margin-top: 25px;
}
</style>