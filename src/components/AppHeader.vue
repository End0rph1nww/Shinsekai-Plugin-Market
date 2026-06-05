<template>
  <header class="site-header">
    <div class="site-header__inner">
      <a class="site-brand" href="https://shinsekai.end0rph1n.icu/" target="_blank" rel="noreferrer">
        <span class="site-brand__mark">新</span>
        <span>
          <strong>Shinsekai Resource Station</strong>
          <small>Plugin Market Console</small>
        </span>
      </a>

      <nav class="site-nav" aria-label="Shinsekai navigation">
        <a href="https://shinsekai.end0rph1n.icu/" target="_blank" rel="noreferrer">资源站</a>
        <a href="https://shinsekai.end0rph1n.icu/discussions" target="_blank" rel="noreferrer">讨论板</a>
        <a href="https://github.com/End0rph1nww/Shinsekai-Plugin-Registry" target="_blank" rel="noreferrer">Registry Fork</a>
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
  background: checked ? '#351f4e' : 'linear-gradient(135deg, #e8789a, #6f55f2)'
})
</script>
