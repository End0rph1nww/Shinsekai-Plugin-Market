<template>
  <div class="market-page">
    <app-header v-model="isDarkMode" />

    <main class="market-shell">
      <section class="market-hero">
        <p class="eyebrow">SHINSEKAI RESOURCE STATION</p>
        <h1>Shinsekai 插件市场</h1>
        <p class="market-hero__lead">
          浏览 Shinsekai 插件、查看仓库与版本信息，并从公开 registry 同步插件索引。
        </p>

        <search-toolbar
          v-model:search-query="searchQuery"
          v-model:selected-tag="selectedTag"
          :filter-options="filterOptions"
        />

        <div class="market-hero__actions">
          <submit-plugin-button />
          <n-button secondary tag="a" :href="registryUrl" target="_blank" rel="noreferrer">查看 registry JSON</n-button>
        </div>
      </section>

      <section class="market-stats" aria-label="插件市场统计">
        <div>
          <strong>{{ stats.total }}</strong>
          <span>全部插件</span>
        </div>
        <div>
          <strong>{{ stats.authors }}</strong>
          <span>作者</span>
        </div>
        <div>
          <strong>{{ stats.repos }}</strong>
          <span>仓库</span>
        </div>
        <div>
          <strong>{{ stats.installable }}</strong>
          <span>可安装</span>
        </div>
      </section>

      <section class="market-board">
        <div class="market-board__head">
          <div>
            <h2>所有插件({{ filteredPlugins.length }})</h2>
            <p>来自公开 registry 的插件索引。</p>
          </div>

          <div class="market-board__tools">
            <button class="icon-button" type="button" title="刷新插件索引" @click="loadPlugins()">↻</button>
            <label class="sort-select">
              <span>排序</span>
              <select :value="sortBy" @change="sortBy = $event.target.value">
                <option value="recommended">默认排序</option>
                <option value="name">名称</option>
                <option value="author">作者</option>
                <option value="updated">更新时间</option>
                <option value="repo">仓库优先</option>
              </select>
            </label>
          </div>
        </div>

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
          <span v-if="plugins.length === 0">registry 当前为空，或返回了空数组。</span>
          <span v-else>试试清空搜索词或切换筛选条件。</span>
          <n-button size="small" secondary @click="clearFilters">清空筛选</n-button>
        </div>

        <template v-else>
          <div class="plugin-grid">
            <plugin-card
              v-for="plugin in paginatedPlugins"
              :key="plugin.id"
              :plugin="plugin"
              @select="openDetails"
            />
          </div>

          <div class="market-pagination" aria-label="分页">
            <button class="page-button" type="button" :disabled="currentPage <= 1" @click="setPage(currentPage - 1)">‹</button>
            <button
              v-for="page in visiblePages"
              :key="page.key"
              class="page-button"
              :class="{ active: page.value === currentPage, ellipsis: page.ellipsis }"
              type="button"
              :disabled="page.ellipsis"
              @click="!page.ellipsis && setPage(page.value)"
            >
              {{ page.label }}
            </button>
            <button class="page-button" type="button" :disabled="currentPage >= totalPages" @click="setPage(currentPage + 1)">›</button>
          </div>
        </template>
      </section>
    </main>

    <plugin-details v-model:show="showDetails" :plugin="selectedPlugin" />
    <app-footer />
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
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
  paginatedPlugins,
  totalPages,
  currentPage,
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
const { loadPlugins, setPage } = store

const selectedPlugin = ref(null)
const showDetails = ref(false)

const visiblePages = computed(() => {
  const total = totalPages.value
  const current = currentPage.value

  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => {
      const value = index + 1
      return { key: `page-${value}`, value, label: String(value) }
    })
  }

  const values = new Set([1, total, current, current - 1, current + 1])
  if (current <= 3) [2, 3, 4].forEach(value => values.add(value))
  if (current >= total - 2) [total - 1, total - 2, total - 3].forEach(value => values.add(value))

  const sorted = [...values].filter(value => value >= 1 && value <= total).sort((a, b) => a - b)
  const pages = []
  sorted.forEach((value, index) => {
    const previous = sorted[index - 1]
    if (previous && value - previous > 1) {
      pages.push({ key: `ellipsis-${previous}-${value}`, label: '...', ellipsis: true })
    }
    pages.push({ key: `page-${value}`, value, label: String(value) })
  })
  return pages
})

function openDetails(plugin) {
  selectedPlugin.value = plugin
  showDetails.value = true
}

function clearFilters() {
  searchQuery.value = ''
  selectedTag.value = 'all'
  sortBy.value = 'recommended'
}

onMounted(() => {
  loadPlugins()
})
</script>
