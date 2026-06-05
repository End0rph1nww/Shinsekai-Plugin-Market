<template>
  <header class="site-header">
    <div class="site-header__inner">
      <a class="site-brand" href="https://shinsekai.end0rph1n.icu/" target="_blank" rel="noreferrer">
        <img class="site-brand__logo" src="/plugin-market-logo.png" alt="Shinsekai Plugin Market" />
        <span class="site-brand__text">
          <strong>Shinsekai</strong>
          <small>Plugin Market</small>
        </span>
      </a>

      <nav class="site-nav" aria-label="Shinsekai navigation">
        <a href="https://shinsekai.end0rph1n.icu/" target="_blank" rel="noreferrer">首页</a>
        <a href="https://shinsekai.end0rph1n.icu/discussions" target="_blank" rel="noreferrer">讨论板</a>
        <a href="https://github.com/RachelForster/Shinsekai" target="_blank" rel="noreferrer">GitHub</a>
        <a href="https://github.com/RachelForster/Shinsekai-Plugin-Registry" target="_blank" rel="noreferrer">Registry</a>
      </nav>

      <div class="site-actions">
        <n-button secondary size="small" tag="a" href="https://github.com/RachelForster/Shinsekai-Plugin-Registry/issues/new" target="_blank" rel="noreferrer">
          提交插件
        </n-button>
        <n-switch
          :value="modelValue"
          :rail-style="railStyle"
          :aria-label="modelValue ? '切换到浅色主题' : '切换到深色主题'"
          @update:value="$emit('update:modelValue', $event)"
        >
          <template #checked>
            <n-icon><moon-sharp /></n-icon>
          </template>
          <template #unchecked>
            <n-icon><sunny-sharp /></n-icon>
          </template>
        </n-switch>
      </div>
    </div>
  </header>
</template>

<script setup>
import { NButton, NIcon, NSwitch } from 'naive-ui'
import { MoonSharp, SunnySharp } from '@vicons/ionicons5'

defineProps({
  modelValue: Boolean
})

defineEmits(['update:modelValue'])

const railStyle = ({ checked }) => ({
  background: checked ? '#4a3268' : 'linear-gradient(135deg, #e8789a, #7c63f4)'
})
</script>
