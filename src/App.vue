<template>
  <n-config-provider
    :theme="theme"
    :theme-overrides="isDarkMode ? darkThemeOverrides : lightThemeOverrides"
    :hljs="highlightConfig.hljs"
  >
    <n-message-provider>
      <div class="app-container" :class="{ dark: isDarkMode }">
        <router-view />
      </div>
    </n-message-provider>
  </n-config-provider>
</template>

<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { darkTheme, NConfigProvider, NMessageProvider } from 'naive-ui'
import { highlightConfig } from './plugins/highlight'
import { lightThemeOverrides } from './config/lightTheme'
import { darkThemeOverrides } from './config/darkTheme'
import { usePluginStore } from './stores/plugins'

const store = usePluginStore()
const { isDarkMode } = storeToRefs(store)
const theme = computed(() => (isDarkMode.value ? darkTheme : null))
</script>

<style>
* {
  box-sizing: border-box;
}

html {
  min-height: 100%;
  background: var(--bg-base);
}

body {
  margin: 0;
  min-height: 100%;
  font-family: "Fira Sans", "Noto Sans SC", "PingFang SC", "Microsoft YaHei", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  color: var(--text-primary);
  background: var(--bg-base);
}

button,
input,
select,
textarea {
  font: inherit;
}

.app-container {
  min-height: 100vh;
  background: var(--bg-base);
}

a {
  color: inherit;
}
</style>
