<template>
  <n-button
    type="primary"
    size="medium"
    @click="router.push({ name: 'SubmitPlugin' })"
  >
    <template #icon>
      <n-icon><add-circle /></n-icon>
    </template>
    提交插件
  </n-button>
</template>

<script setup>
import { NButton, NIcon } from 'naive-ui'
import { AddCircle } from '@vicons/ionicons5'
import { useRouter } from 'vue-router'

const router = useRouter()
</script>
