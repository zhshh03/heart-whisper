<script setup>
import { ElMessage } from 'element-plus'
import { ref, nextTick } from 'vue'
import { updatFile } from '@/apis/admin'
import { baseFileUrl } from '@/config'
import RichTextEditor from '@/views/Dashboard/components/RichTextEditor.vue';
import { addArticleAPI } from '@/apis/admin';

const modelValue = defineModel({
  type: Boolean,
  default: false
})

const props = defineProps({
  categories: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['success'])

const commonTags = ['情绪管理', '焦虑', '抑郁', '压力', '睡眠', '冥想', '正念', '放松', '心理健康', '自我成长', '人际关系', '工作压力', '学习方法', '生活技巧']

const handleClose = () => {
  ruleFormRef.value.resetFields()
  ruleForm.value.tags = ''
  modelValue.value = false
}

const ruleFormRef = ref()
const ruleForm = ref({
  "title": "",
  "content": "",
  "coverImage": "",
  "categoryId": "",
  "summary": "",
  "tags": "",
  "id": ""
})

const rules = ref({
  title: [
    { required: true, message: '请输入文章标题', trigger: 'blur' },
    { max: 200, message: '标题长度不能超过200个字符', trigger: 'blur' }
  ],
  categoryId: [
    { required: true, message: '请选择所属分类', trigger: 'change' }
  ],
  content: [
    { required: true, message: '请输入文章内容', trigger: 'change' },
    { max: 5000, message: '内容长度不能超过5000个字符', trigger: 'blur' }
  ]
})

const imgUrl = ref('')

const beforeUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLt5M = file.size / 1024 / 1024 < 5
  if (!isImage) {
    ElMessage.error('文件错误，请上传图片文件')
    return false
  }
  if (!isLt5M) {
    ElMessage.error('图片大小不能超过5MB')
    return false
  }
  return true
}

const handleUploadRequest = async ({ file }) => {
  const businessId = crypto.randomUUID()

  const res = await updatFile(file, { businessId: businessId })
  imgUrl.value = baseFileUrl + res.data.filePath
  ruleForm.value.coverImage = res.data.filePath

}

const handleRemove = () => {
  imgUrl.value = ''
  ruleForm.value.coverImage = ''
}

const handleContentChange = (data) => {
  ruleForm.value.content = data.html
}
const handleEditorCreated = (editor) => {
  if (ruleForm.value.content) {
    nextTick(() => {
      editor.setHtml(ruleForm.value.content)
    })
  }
}

const handleSubmit = () => {
  ruleFormRef.value.validate(async (valid) => {
    if (valid) {
      ruleForm.value.tags = ruleForm.value.tags.join(',')
      await addArticleAPI(ruleForm.value)
      ElMessage.success('文章创建成功')
      emit('success')
      handleClose()
    } else {
      ElMessage.error('请填写完整信息')
      return
    }
  })

}


</script>

<template>
  <el-dialog v-model="modelValue" @close="handleClose" title="新增" width="50%">
    <el-form ref="ruleFormRef" style="max-width: 750px" :model="ruleForm" :rules="rules" label-width="auto">
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="ruleForm.title" clearable maxlength="200" show-word-limit placeholder="请输入文章标题" />
      </el-form-item>
      <el-form-item label="所属分类" prop="categoryId">
        <el-select v-model="ruleForm.categoryId" placeholder="请选择分类">
          <el-option v-for="opt in props.categories" :key="opt.value" :label="opt.label" :value="opt.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="文章摘要">
        <el-input type="textarea" v-model="ruleForm.summary" :rows="4" maxlength="1000" show-word-limit
          placeholder="请输入文章摘要（可选）" />
      </el-form-item>
      <el-form-item label="标签">
        <el-select v-model="ruleForm.tags" placeholder="请输入或者选择标签" multiple filterable allow-create
          style="width: 100%;">
          <el-option v-for="item in commonTags" :key="item" :label="item.label" :value="item"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="封面图片">
        <div class="cover-upload">
          <el-upload class="avatar-uploader" action="#" accept="image/*" :http-request="handleUploadRequest"
            :before-upload="beforeUpload" :show-file-list="false">
            <div v-if="!imgUrl" class="cover-placeholder">
              <p>点击上传封面</p>
            </div>
            <img v-else :src="imgUrl" class="cover-image" alt="封面图片">
          </el-upload>
          <div v-if="imgUrl">
            <el-button type="danger" size="mini" @click="handleRemove">删除封面</el-button>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="文章内容" prop="content">
        <RichTextEditor v-model="ruleForm.content" placeholder="请输入文章内容..." :maxCharCount="5000"
          @change="handleContentChange" @created="handleEditorCreated" min-height="300px"></RichTextEditor>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="() => { modelValue = false, ruleFormRef.value.resetFields(), ruleForm.value.tags = '' }">取消
        </el-button>
        <el-button type="primary" @click="handleSubmit">
          创建文章
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.cover-placeholder {
  width: 200px;
  height: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #8b949e;
  background-color: #f6f8fa;
}

.cover-image {
  width: 200px;
  height: 120px;
  display: block;
}
</style>