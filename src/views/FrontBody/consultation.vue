<script setup>
/**
 * ============================================================
 *  consultation.vue — AI 心理咨询聊天页面
 * ============================================================
 *  核心功能：
 *  1. 左侧边栏：AI助手状态 + 情绪花园 + 会话历史列表
 *  2. 右侧主区域：聊天消息区 + 输入框
 *  3. 基于 SSE (Server-Sent Events) 的流式 AI 对话
 *  4. 情绪分析：每次对话结束后自动获取情绪评分
 * ============================================================
 */

// ==================== 依赖导入 ====================
import { onMounted, ref, watch, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { createNewChatAPI, getSessionListAPI, deleteSessionAPI, getSessionDetailAPI, getSessionEmotionAPI } from '@/apis/AiConsultation'
import { ChatRound, DeleteFilled } from '@element-plus/icons-vue'
import MarkDownRenderer from '@/views/FrontBody/components/MarkDownRenderer.vue'
import { fetchEventSource } from '@microsoft/fetch-event-source'

// ==================== 静态资源 ====================
const urlImage1 = new URL('@/assets/images/robot-fill.png', import.meta.url).href  // AI头像
const urlImage2 = new URL('@/assets/images/like.png', import.meta.url).href       // 聊天头部图标
const urlImage3 = new URL('@/assets/images/users.png', import.meta.url).href      // 用户头像

// ==================== 核心状态 ====================
const sessionList = ref([])    // 所有历史会话列表
const messageList = ref([])    // 当前会话的消息记录
const currentSession = ref(null)  // 当前会话对象，包含 sessionId / status / sessionTitle
const userMessage = ref('')    // 用户正在输入的消息
const isAiTying = ref(false)   // AI 是否正在回复中（防止重复发送）

// ==================== 用户信息 ====================
const userInfo = ref({})
userInfo.value = JSON.parse(localStorage.getItem('adminInfo'))

// ==================== 会话列表相关 ====================

/** 获取会话列表（从后端拉取，用于左侧展示） */
const getSessionList = async () => {
  const res = await getSessionListAPI({ pageNum: 1, pageSize: 10 })
  sessionList.value = res.data.records
}

/** 点击某个历史会话 → 加载该会话的消息记录 + 情绪数据 */
const handleSessionClick = async (session) => {
  const res = await getSessionDetailAPI(session.id)
  messageList.value = res.data
  // 切换当前会话为 ACTIVE 状态
  currentSession.value = {
    sessionId: "session_" + session.id,
    status: 'ACTIVE',
    sessionTitle: session.sessionTitle
  }
  // 同步获取该会话的情绪分析
  getSessionEmotion(session.id)
}

/** 删除某个会话 → 刷新列表 */
const handleDeleteSession = async (sessionId) => {
  await deleteSessionAPI(sessionId)
  getSessionList()
  ElMessage.success('删除成功')
}

/** 创建新会话 → 将当前会话设为临时状态（TEMP），清空消息展示欢迎语 */
const createNewChat = async () => {
  currentSession.value = {
    sessionId: `temp_${Date.now()}`,
    status: 'TEMP',       // 临时状态，第一条消息发出后才真正创建
    sessionTitle: '新对话'
  }
  messageList.value = []
}

// ==================== 消息发送相关 ====================

/** 键盘事件：Enter 发送，Shift+Enter 换行 */
const handleDown = async (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault()
    sendMessage()
  }
}

/**
 * 发送消息入口
 * - 空消息 → 忽略
 * - AI 正在回复 → 提示等待
 * - 当前是 TEMP 会话 → 调用 startNewSession（首次对话需要先创建会话）
 * - 当前是 ACTIVE 会话 → 直接追加消息 + 请求 AI 回复
 */
const sendMessage = async () => {
  if (userMessage.value.trim() === '') return
  if (isAiTying.value) {
    ElMessage.error('AI助手正在思考中，请稍后')
    return
  }
  const message = userMessage.value.trim()
  userMessage.value = ''

  if (currentSession.value.status === 'TEMP') {
    // 第一次发消息 → 需要先在后端创建会话
    startNewSession(message)
  } else {
    // 已有会话 → 直接追加用户消息，请求 AI 回复
    messageList.value.push({
      id: Date.now(),
      senderType: 1,         // 1 = 用户
      content: message,
      createdAt: new Date().toLocaleString()
    })
    startAIResponse(currentSession.value.sessionId, message)
  }
}

/**
 * 首次发消息 → 调用创建会话 API
 * 创建成功后：更新 currentSession → 刷新列表 → 追加用户消息 → 请求 AI 回复
 */
const startNewSession = async (message) => {
  const sessionParams = { initialMessage: message }
  // 如果标题还是默认"新对话"，则用时间戳命名
  sessionParams.sessionTitle = `宁度AI助手 - ${new Date().toLocaleString()}`

  const res = await createNewChatAPI(sessionParams)
  const sessionData = {
    sessionId: res.data.sessionId,
    status: res.data.status,
    sessionTitle: sessionParams.sessionTitle
  }

  // 将临时会话更新为真实会话
  currentSession.value = sessionData

  getSessionList()  // 刷新左侧会话列表

  // 追加用户消息到聊天区
  messageList.value.push({
    id: Date.now(),
    senderType: 1,
    content: message,
    createdAt: new Date().toLocaleString()
  })

  // 请求 AI 流式回复
  startAIResponse(currentSession.value.sessionId, message)
}

// ==================== AI 流式回复（SSE） ====================

/**
 * 通过 SSE (Server-Sent Events) 获取 AI 的流式回复
 * 流程：
 *  1. 先在 messageList 末尾添加一条空的 AI 消息占位
 *  2. 建立 SSE 连接，逐步将 AI 回复内容拼接到占位消息上
 *  3. 收到 'done' 事件 → 回复完成 → 获取情绪分析
 *  4. 出错 → 显示错误提示
 */
const startAIResponse = (sessionId, userMessage) => {
  isAiTying.value = true

  // 添加 AI 消息占位（content 为空，等 SSE 数据逐步填充）
  const aiMeessage = {
    id: `ai_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    senderType: 2,         // 2 = AI
    content: '',
    createdAt: new Date().toLocaleString()
  }
  messageList.value.push(aiMeessage)

  const ctrl = new AbortController()
  const token = localStorage.getItem('token')

  fetchEventSource('/api/psychological-chat/stream', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'text/event-stream',
      ...(token ? { token } : {})
    },
    body: JSON.stringify({ sessionId, userMessage }),
    signal: ctrl.signal,

    // SSE 连接打开时：验证响应类型
    onopen: (response) => {
      if (response.headers.get('Content-Type') !== 'text/event-stream') {
        ElMessage.error('连接失败')
      }
    },

    // 收到 SSE 消息时：逐步拼接 AI 回复内容
    onmessage: (event) => {
      const raw = event.data.trim()
      if (!raw) return
      const eventName = event.event

      const aiMessage = messageList.value[messageList.value.length - 1]

      // 收到 'done' 事件 → AI 回复结束
      if (eventName === 'done') {
        isAiTying.value = false
        ctrl.abort()
        getSessionEmotion(currentSession.value.sessionId)
        return
      }

      // 正常数据 → 将 content 拼接到 AI 消息上（实现打字机效果）
      const payload = JSON.parse(raw)
      const ok = String(payload.code) === '200'
      if (ok && payload.data && payload.data.content) {
        aiMessage.content += payload.data.content
      } else if (!ok) {
        handleError(payload.msg || 'AI助手出错了')
      }
    },

    // SSE 连接出错
    onerror: () => {
      handleError()
    },

    // SSE 连接关闭 → 确保状态恢复，防止 isAiTying 卡死
    onclose: () => {
      getSessionEmotion(currentSession.value.sessionId)
      if (isAiTying.value) {
        isAiTying.value = false
      }
    }
  })
}

/** 错误处理：将最后一条 AI 消息改为错误提示，恢复状态 */
const handleError = () => {
  const aiMessage = messageList.value[messageList.value.length - 1]
  if (aiMessage) {
    aiMessage.content = 'AI助手出错了'
  }
  isAiTying.value = false
  ElMessage.error('AI助手出错了')
}

// ==================== 消息格式化 & 自动滚动 ====================

/** 将换行符 \n 转为 <br>，用于在 HTML 中展示用户消息 */
const formatMessageContent = (content) => {
  return content.replace(/\n/g, '<br>')
}

const chatMessagesRef = ref(null)

/** 聊天区域滚动到底部（等 DOM 更新后执行） */
const scrollToBottom = async () => {
  await nextTick()
  if (chatMessagesRef.value) {
    chatMessagesRef.value.scrollTop = chatMessagesRef.value.scrollHeight
  }
}

// 监听 messageList 变化，自动滚到底部
watch(messageList, () => {
  scrollToBottom()
}, { deep: true })

// ==================== 情绪花园（情绪分析） ====================

/** 当前会话的情绪分析数据 */
const currentEmotion = ref({
  primaryEmotion: '中性',
  emotionScore: 50,
  isNegative: false,
  riskLevel: 0,
  suggestion: '情绪状态平稳',
  improvementSuggestions: [],
  riskDescription: ''
})

/** 获取当前会话的情绪分析（对话结束后调用） */
const getSessionEmotion = async (sessionId) => {
  const id = sessionId.toString().startsWith('session_') ? sessionId : `session_${sessionId}`
  const res = await getSessionEmotionAPI(id)
  currentEmotion.value = res.data
}

/** 根据情绪分数返回强度等级（1-3），用于控制圆点高亮数量 */
const getIntensityClass = (score) => {
  if (score >= 61) return 3   // 高强度
  if (score >= 31) return 2   // 中强度
  return 1                     // 低强度
}

/** 根据风险等级返回文字描述 */
const getRiskText = (level) => {
  const map = { 0: '正常', 1: '关注', 2: '预警', 3: '危机' }
  return map[level] || '正常'
}

// ==================== 生命周期 ====================

onMounted(() => {
  createNewChat()    // 页面加载时自动创建一个临时新会话
  getSessionList()   // 加载历史会话列表
})
</script>


<template>
  <div class="consultation-container">
    <!-- ==================== 左侧边栏 ==================== -->
    <div class="sidebar">
      <!-- 1. AI 助手状态卡片（头像 + 在线状态） -->
      <div class="ai-assistant-info">
        <div class="breathing-circle">
          <el-image :src="urlImage1" alt="AI助手" class="assistant-icon" style="width: 25px; height: 25px;"></el-image>
        </div>
        <h3 class="assistant-name">AI助手</h3>
        <div class="online-status">
          <div class="status-dot"></div>
          在线服务中
        </div>
      </div>

      <!-- 2. 情绪花园卡片（情绪分数 + 建议 + 治愈行动 + 风险提示） -->
      <div class="emotion-garden">
        <div class="garden-header">
          <div class="garden-title">情绪花园</div>
        </div>
        <div class="emotion-info">
          <div class="emotion-name">{{ currentEmotion.primaryEmotion }}</div>
          <div class="emotion-score">{{ currentEmotion.emotionScore || 50 }}</div>
        </div>
        <div class="warm-tips">
          <div class="emotion-status-text">
            <span class="status-label">今天感觉</span>
            <span class="status-emotion">{{ currentEmotion.isNegative ? '别伤心' : '好心情' }}</span>
          </div>
          <div class="emotion-intensity">
            <span class="intensity-dots">
              <span v-for="dot in 3" :key="dot" class="dot"
                :class="{ 'active': getIntensityClass(currentEmotion.emotionScore) >= dot }"></span>
            </span>
            <span class="intnesity-text">
              {{ getRiskText(currentEmotion.riskLevel) }}
            </span>
          </div>
          <div class="warm-suggestion" v-if="currentEmotion.suggestion">
            <div class="suggestion-icon">💝</div>
            <div class="suggestion-content">
              <div class="suggestion-title">给你的小建议</div>
              <div class="suggestion-text">{{ currentEmotion.suggestion }}</div>
            </div>
          </div>
          <div class="healing-actions" v-if="currentEmotion.improvementSuggestions.length > 0">
            <div class="actions-title">治愈小行动</div>
            <div class="actions-list">
              <div v-for="action in currentEmotion.improvementSuggestions" :key="action" class="action-item">
                <div class="action-icon">⭐</div>
                <div class="action-text">{{ action }}</div>
              </div>
            </div>
          </div>
          <div class="risk-notice" v-if="currentEmotion.isNegative && currentEmotion.riskLevel > 1">
            <div class="notice-icon"></div>
            <div class="notice-content">
              <div class="notice-title">温馨提示</div>
              <div class="notice-text">{{ currentEmotion.riskDescription }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 3. 会话历史列表（点击切换会话，可删除） -->
      <div class="session-history">
        <h4 class="section-title">会话列表</h4>
        <div class="session-list">
          <div v-for="session in sessionList" :key="session.id" @click="handleSessionClick(session)"
            class="session-item" :class="{ active: currentSession?.sessionId === 'session_' + session.id }">
            <div class="session-info">
              <div class="session-title">
                <span>{{ session.sessionTitle }}</span>
                <div class="session-meta">
                  <span class="session-time">{{ session.startedAt }}</span>
                </div>
                <div class="session-preview">
                  {{ session.lastMessageContent }}
                </div>
                <div class="session-stats">
                  <span>
                    <el-icon>
                      <ChatRound />
                    </el-icon>
                    {{ session.messageCount || 0 }}
                  </span>
                  <span>
                    <el-icon>
                      <Clock />
                    </el-icon>
                    {{ session.durationMinutes || 0 }}分钟
                  </span>
                </div>
              </div>
              <div class="session-actions">
                <el-button text type="danger" size="mini" @click.stop="handleDeleteSession(session.id)">
                  <el-icon>
                    <DeleteFilled />
                  </el-icon>
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ==================== 右侧聊天主区域 ==================== -->
    <div class="chat-main">
      <!-- 聊天顶部栏（AI 名称 + 新建会话按钮） -->
      <div class="chat-header">
        <div class="header-left">
          <div class="chat-avatar">
            <el-image style="width: 30px; height: 30px;" :src="urlImage2"></el-image>
          </div>
          <div class="chat-info">
            <h2>宁度AI助手</h2>
            <p>您的贴心AI心理健康助手</p>
          </div>
        </div>
        <el-button circle @click="createNewChat" title="新建会话">
          <el-icon>
            <Plus />
          </el-icon>
        </el-button>
      </div>
      <!-- 聊天消息区 -->
      <div class="chat-messages" ref="chatMessagesRef">
        <!-- 无消息时显示欢迎语 -->
        <div class="message-item ai-message" v-if="messageList.length === 0">
          <div class="message-avatar">
            <el-image :src="urlImage1" style="width: 18px; height: 18px;"></el-image>
          </div>
          <div class="message-content">
            <div class="message-bubble">
              <p>你好：{{ userInfo.nickname }}，我是宁度AI助手，很高兴为您服务。</p>
            </div>
            <div class="message-time">刚刚</div>
          </div>
        </div>
        <!-- 消息列表：senderType=1 用户消息（右侧），senderType=2 AI消息（左侧） -->
        <div v-for="msg in messageList" :key="msg.id" class="message-item"
          :class="msg.senderType === 1 ? 'user-message' : 'ai-message'">
          <div class="message-avatar">
            <el-image v-if="msg.senderType === 1" style="width: 18px; height: 18px;" :src="urlImage3"></el-image>
            <el-image v-if="msg.senderType === 2" style="width: 18px; height: 18px;" :src="urlImage1"></el-image>
          </div>
          <div class="message-content">
            <div class="message-bubble">
              <!-- AI 正在思考：显示三个跳动圆点 -->
              <div class="typing-indicator" v-if="msg.senderType === 2 && isAiTying && !msg.content">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
              </div>
              <!-- AI 回复出错 -->
              <div class="error-message" v-else-if="msg.isError">
                <p>{{ msg.content }}</p>
              </div>
              <!-- AI 正常回复：使用 Markdown 渲染 -->
              <MarkDownRenderer v-else-if="msg.senderType === 2 && !msg.isError" :content="msg.content"
                :is-ai-message="true"></MarkDownRenderer>
              <!-- 用户消息：纯文本，换行符转 <br> -->
              <p v-else-if="msg.content" v-html="formatMessageContent(msg.content)"></p>
            </div>
            <!-- AI 正在输入时显示"正在输入"，否则显示时间 -->
            <div class="message-time">{{ msg.senderType === 2 && isAiTying ? '正在输入' : msg.createdAt }}</div>
          </div>
        </div>
      </div>
      <!-- 底部输入区 -->
      <div class="chat-input">
        <div class="input-container">
          <el-input v-model="userMessage" placeholder="请输入内容" type="textarea" :rows="3" :disabled="isAiTying" clearable
            class="message-input" @keydown="handleDown"></el-input>
          <div class="input-footer">
            <span>按Enter发送，Shift+Enter换行</span>
            <span>{{ userMessage.length }}/500</span>
          </div>
        </div>
        <el-button type="primary" class="send-btn" @click="sendMessage"
          :disabled="userMessage.length > 500 || isAiTying">
          <el-icon>
            <Promotion />
          </el-icon>
        </el-button>
      </div>
    </div>
  </div>
</template>


<style lang="scss" scoped>
.consultation-container {
  margin: 0 auto;
  width: 1200px;
  display: flex;
  gap: 20px;
  padding: 20px;

  .sidebar {
    width: 320px;

    .ai-assistant-info {
      margin-bottom: 20px;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 252, 248, 0.95) 100%);
      border-radius: 16px;
      padding: 16px;
      box-shadow: 0 8px 32px rgba(251, 146, 60, 0.06), 0 2px 8px rgba(0, 0, 0, 0.04);
      border: 1px solid rgba(251, 146, 60, 0.08);
      backdrop-filter: blur(10px);
      transition: all 0.3s ease;

      .breathing-circle {
        width: 60px;
        height: 60px;
        background: linear-gradient(135deg, #fb923c 0%, #f59e0b 100%);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 12px;
        animation: breathing 4s ease-in-out infinite;
        box-shadow: 0 6px 24px rgba(251, 146, 60, 0.25);
        position: relative;
      }

      .assistant-name {
        font-size: 16px;
        font-weight: 700;
        background: linear-gradient(135deg, #fb923c, #f59e0b);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        text-align: center;
        background-clip: text;
        margin: 0 0 12px;
      }

      .online-status {
        display: flex;
        align-items: center;
        justify-content: center;
        color: #059669;
        font-size: 12px;
        font-weight: 600;

        .status-dot {
          width: 8px;
          height: 8px;
          background: #059669;
          border-radius: 50%;
          margin-right: 8px;
          animation: pulse 2s infinite;
          box-shadow: 0 0 8px rgba(5, 150, 105, 0.4);
        }
      }
    }

    .session-history {
      background: white;
      border-radius: 16px;
      padding: 16px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
      margin-bottom: 20px;
      min-height: 250px;
      display: flex;
      flex-direction: column;

      .section-title {
        font-size: 16px;
        font-weight: 600;
        color: #333;
        margin: 0 0 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;

      }

      .session-list {
        overflow-y: auto;
        max-height: 200px;
        scrollbar-width: thin;
        scrollbar-color: rgba(64, 150, 255, 0.3) transparent;

        .session-item {
          position: relative;
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 12px;
          margin-bottom: 8px;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          border: 2px solid transparent;

          &:hover {
            background: #f8f9ff;
            border-color: #e6f0ff;
          }

          &.active {
            background: #e6f0ff;
            border-color: #4096ff;
          }

          .session-info {
            flex: 1;

            .session-title {
              font-weight: 500;
              font-size: 14px;
              color: #333;
              margin-bottom: 4px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;

              .session-meta {
                display: flex;
                align-items: center;
                gap: 8px;
                margin-bottom: 6px;

                .session-time {
                  font-size: 12px;
                  color: #999;
                }
              }

              .session-preview {
                width: 200px;
                font-size: 12px;
                color: #666;
                margin-bottom: 6px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }

              .session-stats {
                display: flex;
                align-items: center;
                gap: 12px;

                span {
                  font-size: 12px;
                  color: #999;
                  display: flex;
                  align-items: center;
                  gap: 4px;
                }
              }
            }

            .session-actions {
              position: absolute;
              top: 10px;
              right: 12px;
            }
          }
        }

        .no-sessions-text {
          text-align: center;
          font-size: 14px;
          color: #999;
        }
      }
    }

    .emotion-garden {
      background: linear-gradient(135deg, #fef9e7 0%, #fcf4e6 50%, #f6f0e8 100%);
      border-radius: 20px;
      padding: 16px;
      margin-bottom: 20px;
      box-shadow: 0 8px 32px rgba(252, 244, 230, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.2);
      position: relative;
      overflow: hidden;
      min-height: 300px;

      .garden-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 20px;
        position: relative;
        z-index: 2;

        .garden-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 16px;
          font-weight: 600;
          color: #8b4513;
        }
      }

      .emotion-info {
        margin: 0 auto;
        width: 80px;
        height: 80px;
        border-radius: 50%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 10;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        border: 2px solid rgba(255, 255, 255, 0.8);
        background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%);
        color: #fff;

        .emotion-name {
          font-size: 15px;
          font-weight: 600;
          line-height: 1;
          margin-bottom: 2px;
        }

        .emotion-score {
          font-size: 14px;
          font-weight: 700;
          opacity: 0.9;
        }
      }

      .warm-tips {
        text-align: center;
        margin-bottom: 16px;

        .emotion-status-text {
          margin-bottom: 12px;

          .status-label {
            font-size: 14px;
            color: #8b7355;
            margin-right: 8px;
          }

          .status-emotion {
            font-size: 16px;
            font-weight: 600;
            padding: 4px 12px;
            border-radius: 16px;
            display: inline-block;
          }
        }

        .emotion-intensity {
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;

          .intensity-dots {
            display: flex;
            gap: 4px;

            .dot {
              width: 8px;
              height: 8px;
              border-radius: 50%;
              background: #e0e0e0;
              transition: all 0.3s ease;

              &.active {
                background: linear-gradient(135deg, #ff9a9e, #fecfef);
                transform: scale(1.2);
                box-shadow: 0 2px 8px rgba(255, 154, 158, 0.4);
              }
            }
          }

          .intensity-text {
            font-size: 12px;
            color: #8b7355;
            font-weight: 500;
          }
        }

        .warm-suggestion {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.8));
          border-radius: 16px;
          padding: 12px;
          margin-bottom: 16px;
          display: flex;
          align-items: flex-start;
          gap: 10px;
          border: 1px solid rgba(255, 255, 255, 0.6);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);

          .suggestion-icon {
            font-size: 20px;
            flex-shrink: 0;
            margin-top: 2px;
          }

          .suggestion-content {
            text-align: left;
            flex: 1;

            .suggestion-title {
              font-size: 14px;
              font-weight: 600;
              color: #8b7355;
              margin-bottom: 6px;
            }

            .suggestion-text {
              font-size: 13px;
              color: #6b5b47;
              line-height: 1.5;
            }
          }
        }

        .healing-actions {
          margin-bottom: 16px;

          .actions-title {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            font-size: 14px;
            font-weight: 600;
            color: #8b7355;
            margin-bottom: 16px;
          }

          .actions-list {
            display: flex;
            flex-direction: column;
            gap: 10px;

            .action-item {
              background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7));
              border-radius: 12px;
              padding: 12px;
              display: flex;
              align-items: center;
              gap: 10px;
              border: 1px solid rgba(255, 255, 255, 0.5);
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
              text-align: left;

              .action-icon {
                font-size: 14px;
                color: #ffd700;
                flex-shrink: 0;
              }

              .action-text {
                font-size: 12px;
                color: #6b5b47;
                line-height: 1.4;
                flex: 1;
              }
            }
          }
        }

        .risk-notice {
          background: linear-gradient(135deg, #fff9e6, #ffeaa7);
          border-radius: 16px;
          padding: 16px;
          display: flex;
          align-items: flex-start;
          gap: 12px;
          border: 1px solid rgba(255, 234, 167, 0.6);
          box-shadow: 0 6px 20px rgba(255, 234, 167, 0.3);

          .notice-icon {
            font-size: 20px;
            flex-shrink: 0;
            margin-top: 2px;
          }

          .notice-content {
            flex: 1;

            .notice-title {
              font-size: 14px;
              font-weight: 600;
              color: #d4840f;
              margin-bottom: 6px;
            }

            .notice-text {
              font-size: 13px;
              color: #b8740c;
              line-height: 1.5;
            }
          }
        }
      }
    }
  }

  .chat-main {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 252, 250, 0.98) 100%);
    border-radius: 20px;
    box-shadow: 0 12px 40px rgba(251, 146, 60, 0.08), 0 4px 16px rgba(0, 0, 0, 0.04);
    border: 1px solid rgba(251, 146, 60, 0.1);
    backdrop-filter: blur(10px);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    flex: 1;

    .chat-header {
      background: linear-gradient(135deg, #fb923c 0%, #f59e0b 100%);
      color: white;
      padding: 20px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: relative;
      flex-shrink: 0;

      .header-left {
        display: flex;
        align-items: center;

        .chat-avatar {
          width: 48px;
          height: 48px;
          background: rgba(255, 255, 255, 0.25);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 16px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          position: relative;
          z-index: 1;
        }

        .chat-info {
          h2 {
            font-size: 20px;
            font-weight: 700;
            margin-bottom: 4px;
          }

          p {
            font-size: 14px;
          }
        }
      }
    }

    .chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 252, 248, 0.05) 100%);
      min-height: 0;
      max-height: calc(100vh - 200px);
      scrollbar-width: thin;
      scrollbar-color: rgba(251, 146, 60, 0.3) transparent;

      .message-item {
        display: flex;
        align-items: flex-start;
        gap: 12px;

        .message-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          color: white;
          flex-shrink: 0;
        }

        &.ai-message {
          .message-avatar {
            background: linear-gradient(135deg, #fb923c, #f59e0b);
            box-shadow: 0 4px 12px rgba(251, 146, 60, 0.3);
          }
        }

        &.user-message {
          // 用户消息靠右
          flex-direction: row-reverse;

          .message-content {
            text-align: right;

            .message-bubble {
              // 用户气泡用主题色背景
              background: linear-gradient(135deg, #fb923c 0%, #f59e0b 100%);
              border: none;
              box-shadow: 0 4px 16px rgba(251, 146, 60, 0.2);
              color: #fff;
            }

            .message-time {
              text-align: right;
            }
          }

          .message-avatar {
            background: linear-gradient(135deg, #6b7280, #4b5563);
            box-shadow: 0 4px 12px rgba(107, 114, 128, 0.3);
          }
        }

        .message-content {
          max-width: 70%;

          .message-bubble {
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 252, 248, 0.95) 100%);
            border-radius: 16px;
            padding: 12px 16px;
            position: relative;
            animation: fadeInUp 0.4s ease-out;
            border: 1px solid rgba(251, 146, 60, 0.1);
            box-shadow: 0 4px 16px rgba(251, 146, 60, 0.05);

            .typing-indicator {
              display: flex;
              gap: 4px;
              padding: 8px 0;

              .typing-dot {
                width: 8px;
                height: 8px;
                background: #ccc;
                border-radius: 50%;
                animation: typing 1.5s ease-in-out infinite;

                &:nth-child(2) {
                  animation-delay: 0.2s;
                }

                &:nth-child(3) {
                  animation-delay: 0.4s;
                }
              }
            }

            /* 错误消息样式 */
            .error-message {
              background: linear-gradient(135deg, #FEF2F2 0%, #FECACA 100%);
              border: 1px solid #F87171;
              border-radius: 12px;
              padding: 12px 16px;
              color: #991B1B;
              font-weight: 500;
              display: flex;
              align-items: center;
              gap: 8px;
            }
          }

          .message-time {
            font-size: 12px;
            color: #999;
            margin-top: 4px;
          }
        }
      }
    }

    .chat-input {
      border-top: 1px solid rgba(251, 146, 60, 0.1);
      padding: 20px 24px;
      display: flex;
      gap: 12px;
      align-items: flex-end;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 252, 248, 0.7) 100%);
      backdrop-filter: blur(10px);
      flex-shrink: 0;

      .input-container {
        flex: 1;
      }

      .input-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 12px;
        color: #78716c;
        font-weight: 500;
      }

      .send-btn {
        height: 60px;
        width: 60px;
        border-radius: 16px;
        background: linear-gradient(135deg, #fb923c 0%, #f59e0b 100%) !important;
        border: none !important;
        box-shadow: 0 6px 20px rgba(251, 146, 60, 0.25);
        transition: all 0.3s ease;
      }

    }

  }
}
</style>