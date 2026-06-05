<template>
  <n-button
    type="primary"
    size="medium"
    tag="a"
    href="https://github.com/RachelForster/Shinsekai-Plugin-Registry/issues/new"
    target="_blank"
    rel="noreferrer"
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
</script>
