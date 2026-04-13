<script setup>
const props = defineProps({
  title:{
    type: String,
    required: true
  }
})

</script>

<template>
  <div class="page-header">
    <p class="title">{{ props.title }}</p>
    <div class="action-button">
      <slot name="button"></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.page-header{
  display: flex;
  align-items: center;
  justify-content: space-between;

  .title{
    font-size: 24px;
    color: #2d3748;
  }
}

</style>