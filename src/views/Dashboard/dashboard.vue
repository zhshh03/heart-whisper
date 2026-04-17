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
const consultationChartData = ref([])
const userActivityChartData = ref([])
const loading = ref(false)

const getAdminDashboard = async () => {
  loading.value = true
  const res = await getAdminDashboardAPI()
  trendChartData.value = res.data.emotionTrend
  dashboardCardData.value = res.data.systemOverview
  consultationChartData.value = res.data.consultationStats
  userActivityChartData.value = res.data.userActivity
  loading.value = false
  initCharts()
}

let emotionChart = null
let consultationChart = null
let userActivityChart = null

const emotionChartRef = ref(null)
const consultationChartRef = ref(null)
const userActivityChartRef = ref(null)

const initCharts = () => {
  initEmotionChart()
  initConsultationChart()
  initUserActivityChart()
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

const initConsultationChart = () => {
  if (!consultationChartRef.value) return
  if (consultationChart) {
    consultationChart.dispose()
  }
  consultationChart = echarts.init(consultationChartRef.value)
  const option = {
    title: {
      text: '咨询活动统计',
      textStyle: {
        fontSize: 16,
        fontWeight: 600,
        color: '#2d3436'
      },
      left: 'center',
      top: 10
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#fab1a0',
      borderWidth: 1,
      textStyle: {
        color: '#2d3436'
      }
    },
    legend: {
      data: ['会话数量', '参与用户数'],
      top: 40,
      textStyle: {
        color: '#636e72'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: 80,
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: consultationChartData.value?.dailyTrend.map(item => item.date),
      axisLine: {
        lineStyle: {
          color: 'rgba(244, 162, 97, 0.3)'
        }
      },
      axisLabel: {
        color: '#636e72'
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        color: '#636e72'
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(244, 162, 97, 0.3)'
        }
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(244, 162, 97, 0.1)'
        }
      }
    },
    series: [
      {
        name: '会话数量',
        type: 'bar',
        data: consultationChartData.value?.dailyTrend.map(item => item.sessionCount),
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: '#74b9ff' },
              { offset: 1, color: '#0984e3' }
            ]
          }
        },
        barWidth: '40%'
      },
      {
        name: '参与用户数',
        type: 'bar',
        data: consultationChartData.value?.dailyTrend.map(item => item.userCount),
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: '#fdcb6e' },
              { offset: 1, color: '#f39c12' }
            ]
          }
        },
        barWidth: '40%'
      }
    ]
  }
  consultationChart.setOption(option)

}

const initUserActivityChart = () => {
  if (!userActivityChartRef.value) return
  if (userActivityChart) {
    userActivityChart.dispose()
  }
  userActivityChart = echarts.init(userActivityChartRef.value)

  const option = {
    title: {
      text: '用户活跃度趋势',
      textStyle: {
        fontSize: 16,
        fontWeight: 600,
        color: '#2d3436'
      },
      left: 'center',
      top: 10
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#fab1a0',
      borderWidth: 1,
      textStyle: {
        color: '#2d3436'
      }
    },
    legend: {
      data: ['活跃用户', '新增用户', '日记用户', '咨询用户'],
      top: 40,
      textStyle: {
        color: '#636e72'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: 80,
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: userActivityChartData.value?.map(item => item.date),
      axisLine: {
        lineStyle: {
          color: 'rgba(244, 162, 97, 0.3)'
        }
      },
      axisLabel: {
        color: '#636e72'
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        color: '#636e72'
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(244, 162, 97, 0.3)'
        }
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(244, 162, 97, 0.1)'
        }
      }
    },
    series: [
      {
        name: '活跃用户',
        type: 'line',
        data: userActivityChartData.value?.map(item => item.activeUsers),
        smooth: true,
        lineStyle: {
          width: 3,
          color: '#a29bfe'
        },
        itemStyle: {
          color: '#a29bfe'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(162, 155, 254, 0.4)' },
              { offset: 1, color: 'rgba(162, 155, 254, 0.1)' }
            ]
          }
        }
      },
      {
        name: '新增用户',
        type: 'line',
        data: userActivityChartData.value?.map(item => item.newUsers),
        smooth: true,
        lineStyle: {
          width: 3,
          color: '#fdcb6e'
        },
        itemStyle: {
          color: '#fdcb6e'
        }
      },
      {
        name: '日记用户',
        type: 'line',
        data: userActivityChartData.value?.map(item => item.diaryUsers),
        smooth: true,
        lineStyle: {
          width: 3,
          color: '#00b894'
        },
        itemStyle: {
          color: '#00b894'
        }
      },
      {
        name: '咨询用户',
        type: 'line',
        data: userActivityChartData.value?.map(item => item.consultationUsers),
        smooth: true,
        lineStyle: {
          width: 3,
          color: '#fab1a0'
        },
        itemStyle: {
          color: '#fab1a0'
        }
      }
    ]
  }
  userActivityChart.setOption(option)
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
        <el-col :span="12">
          <el-card>
            <template #header>
              <div class="card-header">
                咨询会话统计
              </div>
            </template>
            <div class="chart-content">
              <div class="consultation-stats">
                <div class="stat-item">
                  <div class="stat-label">总会话数</div>
                  <div class="stat-value">{{ consultationChartData.totalSessions }}</div>
                </div>
                <div class="stat-item">
                  <div class="stat-label">平均时长</div>
                  <div class="stat-value">{{ consultationChartData.avgDurationMinutes }}</div>
                </div>
                <div class="stat-item">
                  <div class="stat-label">活跃用户</div>
                  <div class="stat-value">{{ dashboardCardData?.activeUsers }}</div>
                </div>
              </div>
              <div ref="consultationChartRef" style="width: 100%; height: 260px;"></div>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-row style="margin-top: 20px;">
        <el-card style="width: 100%;">
          <template #header>
            <div class="card-header">
              用户活跃度趋势
            </div>
          </template>
          <div class="chart-content">
            <div ref="userActivityChartRef" style="width: 100%; height: 300px;"></div>
          </div>
        </el-card>
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