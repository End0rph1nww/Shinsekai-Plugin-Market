<template>
  <div class="market-page">
    <app-header v-model="isDarkMode" />
    <main class="market-shell submit-shell">
      <section class="market-hero">
        <p class="eyebrow">SHINSEKAI SYSTEM / SUBMIT PLUGIN</p>
        <h1>提交 Shinsekai 插件</h1>
        <p class="market-hero__lead">
          当前市场不提供登录和上传服务。插件信息通过公开 registry issue 提交，由维护者审核后合并。
        </p>
        <n-button type="primary" tag="a" href="https://github.com/RachelForster/Shinsekai-Plugin-Registry/issues/new" target="_blank" rel="noreferrer">
          打开提交 Issue
        </n-button>
      </section>

      <section class="submit-guide">
        <div class="guide-grid">
          <div>
            <h2>当前兼容字段</h2>
            <ul>
              <li><code>name</code>：插件唯一名称。</li>
              <li><code>author</code>：作者名。</li>
              <li><code>repo</code>：GitHub 仓库，例如 <code>owner/repo</code>。</li>
              <li><code>description</code>：简短描述。</li>
              <li><code>entry</code>：插件入口，例如 <code>module.plugin:PluginClass</code>。</li>
            </ul>
          </div>
          <div>
            <h2>未来预留字段</h2>
            <ul>
              <li><code>display_name</code>、<code>version</code>、<code>shinsekai_version</code></li>
              <li><code>download_url</code>、<code>sha256</code>、<code>commit_sha</code></li>
              <li><code>size</code>、<code>updated_at</code>、<code>tags</code>、<code>logo</code></li>
            </ul>
          </div>
        </div>
        <pre>{
  "name": "example_plugin",
  "author": "YourName",
  "repo": "owner/shinsekai-example-plugin",
  "description": "Describe what your plugin does",
  "entry": "example_plugin.plugin:ExamplePlugin"
}</pre>
      </section>
    </main>
    <app-footer />
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { NButton } from 'naive-ui'
import AppHeader from '../components/AppHeader.vue'
import AppFooter from '../components/AppFooter.vue'
import { usePluginStore } from '../stores/plugins'

const store = usePluginStore()
const { isDarkMode } = storeToRefs(store)
</script>
