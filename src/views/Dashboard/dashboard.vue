<script setup>
import { ref, onMounted } from 'vue';
import PageHeader from './components/PageHearder.vue';
import { getAdminDashboardAPI } from '@/apis/adminDashboard'

const title = '数据分析'

const imgUrl1 = new URL('@/assets/images/users.png', import.meta.url).href
const imgUrl2 = new URL('@/assets/images/like.png', import.meta.url).href
const imgUrl3 = new URL('@/assets/images/comments.png', import.meta.url).href
const imgUrl4 = new URL('@/assets/images/smile.png', import.meta.url).href

const dashboardCardData = ref(null)

const getAdminDashboard = async () => {
  const res = await getAdminDashboardAPI()
  dashboardCardData.value = res.data.systemOverview
}

onMounted(() => {
  getAdminDashboard()
})
</script>


<template>
  <div>
    <PageHeader :title="title">
    </PageHeader>
  </div>
  <div class="dashboard-container">
    <el-row :gutter="24">
      <el-col :span="6">
        <el-card v-if="dashboardCardData">
          <div class="card-content">
            <div class="avatar users">
              <el-image style="width: 35px; height: 35px;" :src="imgUrl1"></el-image>
            </div>
            <div class="info">
              <p class="title">用户总数</p>
              <p class="number">{{ dashboardCardData.totalUsers }}</p>
              <p class="subtitle-title">活跃用户：{{ dashboardCardData.activeUsers }}</p>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card v-if="dashboardCardData">
          <div class="card-content">
            <div class="avatar like">
              <el-image style="width: 35px; height: 35px;" :src="imgUrl2"></el-image>
            </div>
            <div class="info">
              <p class="title">情绪日志</p>
              <p class="number">{{ dashboardCardData.totalDiaries }}</p>
              <p class="subtitle-title">今日新增：{{ dashboardCardData.todayNewDiaries }}</p>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card v-if="dashboardCardData">
          <div class="card-content">
            <div class="avatar comments">
              <el-image style="width: 35px; height: 35px;" :src="imgUrl3"></el-image>
            </div>
            <div class="info">
              <p class="title">咨询会话</p>
              <p class="number">{{ dashboardCardData.totalSessions }}</p>
              <p class="subtitle-title">今日新增：{{ dashboardCardData.todayNewSessions }}</p>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card v-if="dashboardCardData">
          <div class="card-content">
            <div class="avatar smile">
              <el-image style="width: 35px; height: 35px;" :src="imgUrl4"></el-image>
            </div>
            <div class="info">
              <p class="title">平均情绪</p>
              <p class="number">{{ dashboardCardData.avgMoodScore }}/10</p>
              <p class="subtitle-title">情绪健康指数</p>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
.dashboard-container {
  .card-content {
    display: flex;
    align-items: center;

    .avatar {
      margin-right: 12px;
      width: 60px;
      height: 60px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;

      &.users {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      }

      &.like {
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      }

      &.comments {
        background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
      }

      &.smile {
        background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
      }
    }

    .info {
      .title {
        font-size: 14px;
        color: #7f8c8d;
        margin-bottom: 4px;
      }

      .value {
        font-size: 24px;
        font-weight: 700;
        color: #2c3e50;
        margin-bottom: 4px
      }

      .subtitle-title {
        font-size: 12px;
        color: #95a5a6;
      }
    }
  }

  .chart-content {
    padding: 20px;
    height: 300px;
    position: relative;

    canvas {
      width: 100% !important;
      height: 100% !important;
    }

    .consultation-stats {
      display: flex;
      justify-content: space-around;
      margin-bottom: 20px;

      .stat-item {
        text-align: center;

        .stat-label {
          font-size: 12px;
          color: #7f8c8d;
          margin-bottom: 4px;
        }

        .stat-value {
          font-size: 18px;
          font-weight: 600;
          color: #2c3e50;
        }
      }
    }
  }
}
</style>