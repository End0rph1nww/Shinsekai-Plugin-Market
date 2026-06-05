<template>
  <div class="market-page">
    <app-header v-model="isDarkMode" />

    <main class="discussion-shell market-shell">
      <section class="discussion-hero market-hero">
        <div>
          <p class="eyebrow">SHINSEKAI SYSTEM / 插件市场</p>
          <h1>浏览、安装、提交和维护 Shinsekai 插件。</h1>
          <p class="market-hero__lead">
            从公开 registry 读取插件索引，当前只提供前台浏览体验，不接密钥、不上传包体、不实现真实安装 API。
          </p>
        </div>
        <div class="market-hero__actions">
          <submit-plugin-button />
          <n-button secondary tag="a" :href="registryUrl" target="_blank" rel="noreferrer">查看 registry JSON</n-button>
        </div>
      </section>

      <section class="market-layout">
        <div class="discussion-panel market-main-panel">
          <div class="panel-heading">
            <div>
              <p class="eyebrow">PLUGIN INDEX</p>
              <h2>插件列表</h2>
            </div>
            <span class="panel-count">{{ filteredPlugins.length }} / {{ stats.total }}</span>
          </div>

          <search-toolbar
            v-model:search-query="searchQuery"
            v-model:selected-tag="selectedTag"
            v-model:sort-by="sortBy"
            :filter-options="filterOptions"
          />

          <div v-if="isLoading" class="state-card">
            <div class="loading-orbit" />
            <strong>正在连接 registry...</strong>
            <span>{{ registryUrl }}</span>
          </div>

          <div v-else-if="error" class="state-card state-card--error">
            <strong>Registry 加载失败</strong>
            <span>{{ error }}</span>
            <n-button size="small" secondary @click="loadPlugins()">重试</n-button>
          </div>

          <div v-else-if="filteredPlugins.length === 0" class="state-card">
            <strong>没有找到插件</strong>
            <span v-if="plugins.length === 0">registry 当前为空，或者返回了空数组。</span>
            <span v-else>试试清空搜索词或切换筛选条件。</span>
            <n-button size="small" secondary @click="clearFilters">清空筛选</n-button>
          </div>

          <div v-else class="plugin-list">
            <plugin-card
              v-for="plugin in filteredPlugins"
              :key="plugin.id"
              :plugin="plugin"
              @select="openDetails"
            />
          </div>
        </div>

        <aside class="market-sidebar">
          <section class="discussion-panel sidebar-card">
            <p class="discussion-panel-title">分类</p>
            <button
              v-for="option in filterOptions"
              :key="option.value"
              type="button"
              class="sidebar-filter"
              :class="{ active: selectedTag === option.value }"
              @click="selectedTag = option.value"
            >
              <span>{{ option.label }}</span>
              <small>{{ countForFilter(option.value) }}</small>
            </button>
          </section>

          <section class="discussion-panel sidebar-card">
            <p class="discussion-panel-title">公告</p>
            <ul class="sidebar-list">
              <li>当前为前台壳：不做后端、上传、登录或付费。</li>
              <li>插件数据来自公开 registry JSON。</li>
              <li>缺失未来字段时 UI 会自动降级。</li>
            </ul>
          </section>

          <section class="discussion-panel sidebar-card">
            <p class="discussion-panel-title">统计</p>
            <div class="stats-grid">
              <div><strong>{{ stats.total }}</strong><span>已收录</span></div>
              <div><strong>{{ stats.authors }}</strong><span>作者</span></div>
              <div><strong>{{ stats.repos }}</strong><span>仓库</span></div>
              <div><strong>{{ stats.installable }}</strong><span>可安装</span></div>
            </div>
          </section>
        </aside>
      </section>
    </main>

    <plugin-details v-model:show="showDetails" :plugin="selectedPlugin" />
    <app-footer />
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { NButton } from 'naive-ui'
import AppHeader from '../components/AppHeader.vue'
import AppFooter from '../components/AppFooter.vue'
import PluginCard from '../components/PluginCard.vue'
import PluginDetails from '../components/PluginDetails.vue'
import SearchToolbar from '../components/SearchToolbar.vue'
import SubmitPluginButton from '../components/SubmitPluginButton.vue'
import { usePluginStore } from '../stores/plugins'

const store = usePluginStore()
const {
  plugins,
  filteredPlugins,
  filterOptions,
  searchQuery,
  selectedTag,
  sortBy,
  isDarkMode,
  isLoading,
  error,
  registryUrl,
  stats
} = storeToRefs(store)
const { loadPlugins } = store

const selectedPlugin = ref(null)
const showDetails = ref(false)

function openDetails(plugin) {
  selectedPlugin.value = plugin
  showDetails.value = true
}

function clearFilters() {
  searchQuery.value = ''
  selectedTag.value = 'all'
  sortBy.value = 'name'
}

function countForFilter(value) {
  if (value === 'all') return plugins.value.length
  if (value === 'listed') return plugins.value.filter(plugin => plugin.repo).length
  if (value === 'installable') return plugins.value.filter(plugin => plugin.installable).length
  return plugins.value.filter(plugin => plugin.tags.includes(value)).length
}

onMounted(() => {
  loadPlugins()
})
</script>
