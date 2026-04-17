<script setup>
import PageHeader from './components/PageHearder.vue';
import CommonForm from '@/components/CommonForm.vue';
import { onMounted, ref } from 'vue'
import { getEmotionalListAPI, deleteEmotionslAPI } from '@/apis/adminEmotional'

const title = '情绪日志'
const formItem = [
  { comp: 'input', prop: 'title', label: '用户ID', placeholder: '请输入用户ID' },
  {
    comp: 'select', prop: 'moodScreRange', label: '情绪评分', placeholder: '请选评分范围', options: [
      {
        label: '低分',
        value: '1-3'
      },
      {
        label: '中分',
        value: '4-6'
      },
      {
        label: '高分',
        value: '7-9'
      }
    ]
  }
]

const pagination = ref({
  size: 8,
  current: 1,
  dominantEmotion: ''
})

const handleChange = (page) => {
  pagination.value.current = page
  handleSearch()
}
const tableData = ref([])
const total = ref(0)
const searchParams = ref({})
//查询
const handleSearch = async (formData) => {
  if (formData && formData.moodScreRange) {
    const [min, max] = formData.moodScreRange.split('-')
    searchParams.value = {
      ...formData,
      userId: formData.userId || undefined,
      minMoodScore: min,
      maxMoodScore: max
    }
    delete searchParams.value.moodScreRange
    pagination.value.current = 1
  } else if (formData) {
    searchParams.value = { ...formData }
    pagination.value.current = 1
  }
  const data = await getEmotionalListAPI({
    ...searchParams.value,
    ...pagination.value
  })
  tableData.value = data.data.records
  total.value = data.data.total
}

//删除情绪日志
const handleDelete = async (id) => {
  await deleteEmotionslAPI(id)
  handleSearch()
}

//详情
const handleDetail = (row) => {
  console.log(row)
}

onMounted(() => {
  handleSearch()
})

</script>


<template>
  <div>
    <PageHeader :title="title">
    </PageHeader>
    <CommonForm :formItem="formItem" @search="handleSearch"></CommonForm>
  </div>

  <el-table :data="tableData" style="margin-top: 25px; width: 100%">
    <el-table-column label="ID" prop="userId" width="80"></el-table-column>
    <el-table-column label="会话ID" width="80">
      <template #default="scope">
        <el-avatar>{{ scope.row.nickname }}</el-avatar>
      </template>
    </el-table-column>
    <el-table-column label="记录日期" prop="createdAt" width="120"></el-table-column>
    <el-table-column label="情绪评分">
      <template #default="scope">
        <el-rate :model-value="scope.row.moodScore" :max=10 disabled :colors="colors" />
      </template>
    </el-table-column>
    <el-table-column label="生活指标" width="120">
      <template #default="scope">
        <div>
          <p>睡眠：{{ scope.row.sleepQuality }}/5</p>
          <p>压力：{{ scope.row.stressLevel }}/5</p>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="情绪触发因素" prop="emotionTriggers" width="120"></el-table-column>
    <el-table-column label="日记内容" prop="diaryContent" width="250"></el-table-column>
    <el-table-column label="操作" width="240" fixed="right">
      <template #default="scope">
        <div style="display: flex; align-items: center">
          <el-button text type="primary" @click="handleDetail(scope.row)">详情</el-button>
          <el-button text type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
        </div>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination :current-page="pagination.current" background style="margin-top: 25px;" layout="prev, pager, next"
    :total="total" :page-size="pagination.size" @current-change="handleChange" />
</template>