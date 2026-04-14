<script setup>
import { defineProps, ref, defineEmits, computed } from 'vue'

//定义事件（将表单数据提交给父组件）
const emit = defineEmits(['search'])
//绑定表单用来重重
const ruleFormRef = ref(null)

//接收表单格式数据（内容）
const props = defineProps({
  formItem: {
    type: Array,
    default: () => []
  }
})

//双向绑定的表单数据
const formData = ref({})

//查询
const handleSearch = () => {
  emit('search', formData.value)
}
//重置
const handleReset = (el) => {
  if (!el) return
  el.resetFields()
  handleSearch()
}
//给表单项添加col属性
const formItemAttrs = computed(() => {
  //就地修改，就地返回
  props.formItem.forEach(item => {
    item.col = { xs: 24, sm: 12, md: 8, lg: 6, xl: 6 }
  })
  return props.formItem
})

</script>

<template>
  <el-form :model="formData" ref="ruleFormRef">
    <el-row :gutter="24">
      <template v-for="item in formItemAttrs" :key="item.prop">
        <el-col v-bind="item.col">
          <el-form-item :label="item.label" :prop="item.prop">

            <el-input v-model="formData[item.prop]" v-if="item.comp === 'input'"
              :placeholder="item.placeholder"></el-input>

            <el-select v-else v-model="formData[item.prop]" :placeholder="item.placeholder">
              <el-option label="全部" value=""></el-option>
              <el-option v-for="opt in (item.options || [])" :key="opt.value" :label="opt.label"
                :value="opt.value"></el-option>
            </el-select>

          </el-form-item>
        </el-col>
      </template>

    </el-row>

    <el-button type="primary" @click="handleSearch">查询</el-button>
    <el-button @click="handleReset(ruleFormRef)">重置</el-button>

  </el-form>
</template>
