<script setup>
import { computed, ref } from 'vue'

const modelValue = defineModel({
  type: Boolean,
  default: false
})

const props = defineProps({
  detailData: {
    type: Object,
    default: () => ({})
  }
})

// 解析 aiEmotionAnalysis 字符串
const aiAnalysis = computed(() => {
  if (!props.detailData.aiEmotionAnalysis) return {}
  try {
    return typeof props.detailData.aiEmotionAnalysis === 'string'
      ? JSON.parse(props.detailData.aiEmotionAnalysis)
      : props.detailData.aiEmotionAnalysis
  } catch {
    return {}
  }
})

const colors = ref(['#FF9900', '#FF6600', '#FF0000'])

// 获取风险等级标签类型
const getRiskTagType = (level) => {
  const map = { 低风险: 'success', 正常: 'success', 中等: 'warning', 高风险: 'danger' }
  return map[level] || 'info'
}

// 获取情绪性质标签类型
const getNatureTagType = (nature) => {
  const map = { 正面情绪: 'success', 负面情绪: 'danger', 中性情绪: 'info' }
  return map[nature] || 'info'
}
</script>

<template>
  <el-dialog v-model="modelValue" title="情绪日志详情" width="55%" :close-on-click-modal="false">
    <!-- 用户信息 -->
    <h3 class="section-title">用户信息</h3>
    <el-descriptions :column="2" border>
      <el-descriptions-item label="用户名">{{ detailData.username }}</el-descriptions-item>
      <el-descriptions-item label="昵称">{{ detailData.nickname }}</el-descriptions-item>
      <el-descriptions-item label="用户ID">{{ detailData.userId }}</el-descriptions-item>
      <el-descriptions-item label="记录日期">{{ detailData.createdAt }}</el-descriptions-item>
    </el-descriptions>

    <!-- 情绪状态 -->
    <h3 class="section-title">情绪状态</h3>
    <el-descriptions :column="2" border>
      <el-descriptions-item label="情绪评分">
        <div style="display: flex; align-items: center; gap: 8px;">
          <el-rate :model-value="detailData.moodScore" :max="10" disabled :colors="colors" />
          <span>{{ detailData.moodScore }}</span>
        </div>
      </el-descriptions-item>
      <el-descriptions-item label="主要情绪">
        <el-tag size="small">{{ detailData.dominantEmotion }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="睡眠质量">{{ detailData.sleepQuality }}/5</el-descriptions-item>
      <el-descriptions-item label="压力水平">{{ detailData.stressLevel }}/5</el-descriptions-item>
    </el-descriptions>

    <!-- 日记内容 -->
    <h3 class="section-title">日记内容</h3>
    <el-descriptions :column="1" border>
      <el-descriptions-item label="情绪触发因素">{{ detailData.emotionTriggers }}</el-descriptions-item>
      <el-descriptions-item label="日记内容">{{ detailData.diaryContent }}</el-descriptions-item>
    </el-descriptions>

    <!-- AI情绪分析结果 -->
    <h3 class="section-title">AI情绪分析结果</h3>
    <el-descriptions :column="2" border v-if="detailData.hasAiEmotionAnalysis">
      <el-descriptions-item label="主要情绪">
        <el-tag size="small" :type="getNatureTagType(aiAnalysis.primaryEmotion)">{{ aiAnalysis.primaryEmotion
          }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="情绪强度">
        <div style="display: flex; align-items: center; gap: 8px; width: 100%;">
          <el-progress :percentage="(aiAnalysis.emotionScore || 0) * 10" :stroke-width="8" style="flex: 1;" />
          <span>{{ (aiAnalysis.emotionScore || 0) * 10 }}%</span>
        </div>
      </el-descriptions-item>
      <el-descriptions-item label="风险等级">
        <el-tag size="small" :type="getRiskTagType(aiAnalysis.riskLevel)">{{ aiAnalysis.riskLevel }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="情绪性质">
        <el-tag size="small" :type="getNatureTagType(aiAnalysis.emotionNature)">{{
          aiAnalysis.emotionNature }}</el-tag>
      </el-descriptions-item>
    </el-descriptions>

    <!-- 专业建议 -->
    <h3 class="section-title">专业建议</h3>
    <div class="suggestion-box">{{ aiAnalysis.suggestion || '暂无建议' }}</div>

    <!-- 风险描述 -->
    <h3 class="section-title">风险描述</h3>
    <div class="suggestion-box">{{ aiAnalysis.riskDescription || '暂无描述' }}</div>

    <!-- 改善建议 -->
    <h3 class="section-title">改善建议</h3>
    <div class="suggestion-box improvement-list">
      <p v-for="(item, index) in aiAnalysis.improvements" :key="index">{{ item }}</p>
      <p v-if="!aiAnalysis.improvements?.length">暂无改善建议</p>
    </div>

    <template #footer>
      <el-button @click="modelValue = false" type="primary">关闭</el-button>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.section-title {
  margin: 20px 0 12px;
  font-size: 16px;
  font-weight: 600;
  color: #303133;

  &:first-of-type {
    margin-top: 0;
  }
}

.suggestion-box {
  padding: 16px;
  background: #f5f7fa;
  border-radius: 6px;
  line-height: 1.8;
  color: #606266;
  font-size: 14px;

  &.improvement-list {
    p {
      margin: 4px 0;
    }
  }
}
</style>
