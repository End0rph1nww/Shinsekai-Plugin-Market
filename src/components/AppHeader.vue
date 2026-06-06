<template>
  <header class="site-header">
    <div class="site-header__inner">
      <a class="site-brand" :href="siteUrl" target="_blank" rel="noreferrer">
        <img class="site-brand__logo" src="/plugin-market-logo.png" alt="Shinsekai Plugin Market" />
        <span class="site-brand__text">
          <strong>Shinsekai</strong>
          <small>Plugin Market</small>
        </span>
      </a>

      <nav class="site-nav" aria-label="Shinsekai navigation">
        <a :href="siteUrl" target="_blank" rel="noreferrer"><home :size="15" />首页</a>
        <a :href="`${siteUrl}/discussions`" target="_blank" rel="noreferrer"><messages-square :size="15" />讨论板</a>
        <a href="https://github.com/RachelForster/Shinsekai" target="_blank" rel="noreferrer">
          <svg class="github-mark" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
          </svg>
          GitHub
        </a>
        <a href="https://github.com/RachelForster/Shinsekai-Plugin-Registry" target="_blank" rel="noreferrer"><database :size="15" />Registry</a>
      </nav>

      <div class="site-actions">
        <n-button class="submit-nav-button" secondary size="small" @click="goSubmit">
          <template #icon>
            <n-icon><send :size="15" /></n-icon>
          </template>
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
import { Database, Home, MessagesSquare, Send } from '@lucide/vue'
import { useRouter } from 'vue-router'

defineProps({
  modelValue: Boolean
})

defineEmits(['update:modelValue'])

const siteUrl = import.meta.env.VITE_SITE_URL || '/'
const router = useRouter()

function goSubmit() {
  router.push({ name: 'SubmitPlugin' })
}

const railStyle = ({ checked }) => ({
  background: checked ? '#8f314f' : '#e8789a'
})
</script>
