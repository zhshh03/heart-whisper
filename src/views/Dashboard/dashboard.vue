<script setup>
import { ref, onMounted } from 'vue';
import PageHeader from './components/PageHearder.vue';
import { getAdminDashboardAPI } from '@/apis/adminDashboard'
import * as echarts from 'echarts';

const title = '数据分析'

const imgUrl1 = new URL('@/assets/images/users.png', import.meta.url).href
const imgUrl2 = new URL('@/assets/images/like.png', import.meta.url).href
const imgUrl3 = new URL('@/assets/images/comments.png', import.meta.url).href
const imgUrl4 = new URL('@/assets/images/smile.png', import.meta.url).href

const dashboardCardData = ref(null)
const trendChartData = ref([])
const loading = ref(false)

const getAdminDashboard = async () => {
  loading.value = true
  const res = await getAdminDashboardAPI()
  trendChartData.value = res.data.emotionTrend
  dashboardCardData.value = res.data.systemOverview
  loading.value = false
  initCharts()
}

let emotionChart = null

const emotionChartRef = ref(null)

const initCharts = () => {
  initEmotionChart()
}

const initEmotionChart = () => {
  if (!emotionChartRef.value) return
  if (emotionChart) {
    emotionChart.dispose()
  }
  emotionChart = echarts.init(emotionChartRef.value)

  const option = {
    title: {
      text: '情绪趋势分析',
      textStyle: {
        color: '#2d3436',
        fontSize: 16,
        fontWeight: 600
      },
      left: 'center',
      top: 10
    },
    tooltip: {
      trigger: 'axis',
      borderColor: '#fab1a0',
      borderWidth: 1,
      textStyle: {
        color: '#2d3436'
      }
    },
    legend: {
      data: ['平均情绪评分', '记录数量'],
      top: 40
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: 80
    },
    xAxis: {
      type: 'category',
      data: trendChartData.value?.map(item => item.date) || [],
      axisLIne: {
        lineStyle: {
          color: '#2d3436'
        }
      }
    },
    yAxis: [
      {
        type: 'value',
        name: '平均情绪评分',
        position: 'left',
        axisLine: {
          lineStyle: {
            color: '#2d3436'
          }
        },
      },
      {
        type: 'value',
        name: '记录数量',
        position: 'right',
        axisLine: {
          lineStyle: {
            color: '#2d3436'
          }
        },
      }],
    series: [{
      name: '平均情绪评分',
      type: 'line',
      data: trendChartData.value?.map(item => item.avgMoodScore),
      smooth: true,
      lineStyle: {
        width: 3,
        color: '#faebaf'
      },
      itemStyle: {
        color: '#faebaf'
      }
    },
    {
      name: '记录数量',
      type: 'line',
      data: trendChartData.value?.map(item => item.recordCount),
      smooth: true,
      lineStyle: {
        width: 3,
        color: '#eeb5a3'
      },
      itemStyle: {
        color: '#eeb5a3'
      }
    }
    ]
  }
  emotionChart.setOption(option)
}

onMounted(() => {
  getAdminDashboard()
})
</script>


<template>
  <div>
    <PageHeader :title="title">
    </PageHeader>
    <div class="dashboard-container" v-loading="loading">
      <el-row :gutter="20">
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
      <el-row style="margin-top: 20px;" :gutter="20">
        <el-col :span="12">
          <el-card>
            <template #header>
              <div class="card-header">
                情绪分析趋势
              </div>
            </template>
            <div class="chart-content">
              <div ref="emotionChartRef" style="width: 100%; height: 300px;"></div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
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