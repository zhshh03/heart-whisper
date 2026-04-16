<script setup>
import { ref } from 'vue';

const modelValue = defineModel({
  type: Boolean,
  default: false
})

const props = defineProps({
  detail: {
    type: Object,
    required: true
  },
  dialogDetail: {
    type: Array,
    required: true
  }
})

const isLoading = ref(false)
defineExpose({ isLoading })

</script>

<template>
  <el-dialog v-model="modelValue" title="咨询会话详情" :close-on-click-modal="false" width="70%">
    <div class="session-detail">
      <div class="detail-header">
        <div class="detail-row">
          <div class="detail-label">用户：</div>
          <div class="detail-value">{{ props.detail.userNickname }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">开始时间：</div>
          <div class="detail-value">{{ props.detail.startedAt }}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">消息数：</div>
          <div class="detail-value">{{ props.detail.messageCount }}</div>
        </div>
      </div>
      <div class="messages-container">
        <div class="messages-header">
          <h4>对话记录</h4>
        </div>
        <div class="messages-list" v-loading="isLoading">
          <div v-for="item in dialogDetail" :key="item.id" class="message-item"
            :class="item.senderType === 1 ? 'user-message' : 'ai-message'">
            <div class="message-header">
              <span class="sender">{{ item.senderType === 1 ? '用户' : 'AI助手' }}</span>
              <span class="time">{{ item.createdAt }}</span>
            </div>
            <div class="message-content">{{ item.content }}</div>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<style scoped>
.session-title {
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}

.session-preview {
  font-size: 13px;
  color: #666;
  margin-bottom: 4px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.session-detail {
  max-height: 70vh;
  overflow-y: auto;

  .detail-header {
    margin-bottom: 20px;
    padding: 16px;
    background: #f8f9fa;
    border-radius: 8px;
    border: 1px solid #e9ecef;
  }

  .detail-row {
    display: flex;
    align-items: center;
    margin-bottom: 8px;

    :last-child {
      margin-bottom: 0;
    }

    .detail-label {
      font-weight: 500;
      color: #495057;
      min-width: 80px;
      margin-right: 8px;
    }

    .detail-value {
      color: #333;
    }
  }
}

.messages-container {
  margin-top: 20px;

  .messages-header {
    margin-bottom: 16px;

    h4 {
      margin: 0;
      color: #333;
      font-size: 16px;
      font-weight: 500;
    }
  }

  .messages-list {
    max-height: 400px;
    overflow-y: auto;
    border: 1px solid #e9ecef;
    border-radius: 8px;
    padding: 16px;
    background: #fff;

    .message-item {
      margin-bottom: 12px;
      padding: 12px;
      border-radius: 8px;
      background: #f8f9fa;
      border: 1px solid #e9ecef;

      :last-child {
        margin-bottom: 0;
      }

      &.user-message {
        background: #e8f4fd;
      }

      &.ai-message {
        background: #f0f9f0;
      }
    }

    .message-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;

      .sender {
        font-weight: 500;
        color: #333;
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .time {
        font-size: 12px;
        color: #999;
      }

      .message-content {
        color: #333;
        line-height: 1.6;
        white-space: pre-wrap;
        margin-top: 8px;
        font-size: 14px;
      }
    }
  }
}
</style>