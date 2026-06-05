import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import { DEFAULT_REGISTRY_URL, normalizeRegistryPayload } from '../utils/pluginNormalizer'

const PAGE_SIZE = 9

function resolveRegistryUrl() {
  return import.meta.env.VITE_PLUGIN_REGISTRY_URL || DEFAULT_REGISTRY_URL
}

export const usePluginStore = defineStore('plugins', () => {
  const savedTheme = localStorage.getItem('theme-preference')
  const plugins = ref([])
  const searchQuery = ref('')
  const selectedTag = ref('all')
  const sortBy = ref('recommended')
  const currentPage = ref(1)
  const isDarkMode = ref(savedTheme === 'dark')
  const isLoading = ref(false)
  const error = ref('')
  const registryUrl = ref(resolveRegistryUrl())

  watch(isDarkMode, (newValue) => {
    localStorage.setItem('theme-preference', newValue ? 'dark' : 'light')
  })

  watch([searchQuery, selectedTag, sortBy], () => {
    currentPage.value = 1
  })

  const toggleTheme = () => {
    isDarkMode.value = !isDarkMode.value
  }

  const allTags = computed(() => {
    const tags = new Set()
    plugins.value.forEach(plugin => plugin.tags.forEach(tag => tags.add(tag)))
    return Array.from(tags).sort((a, b) => a.localeCompare(b, 'zh-CN'))
  })

  const hasRegistryTags = computed(() => plugins.value.some(plugin => plugin.raw?.tags !== undefined))

  const filterOptions = computed(() => {
    if (hasRegistryTags.value && allTags.value.length > 0) {
      return [
        { label: '全部', value: 'all' },
        ...allTags.value.map(tag => ({ label: tag, value: tag }))
      ]
    }

    return [
      { label: '全部', value: 'all' },
      { label: '已收录', value: 'listed' },
      { label: '可安装', value: 'installable' }
    ]
  })

  const stats = computed(() => {
    const authors = new Set(plugins.value.map(plugin => plugin.author).filter(Boolean))
    const repos = plugins.value.filter(plugin => plugin.repo).length
    const installable = plugins.value.filter(plugin => plugin.installable).length
    return {
      total: plugins.value.length,
      authors: authors.size,
      repos,
      installable,
      tags: allTags.value.length
    }
  })

  const filteredPlugins = computed(() => {
    const keyword = searchQuery.value.trim().toLowerCase()
    const filter = selectedTag.value || 'all'

    const result = plugins.value.filter(plugin => {
      const matchesKeyword = !keyword || [
        plugin.name,
        plugin.displayName,
        plugin.description,
        plugin.author,
        plugin.repo
      ].some(value => String(value || '').toLowerCase().includes(keyword))

      const matchesFilter = filter === 'all'
        || (filter === 'listed' && Boolean(plugin.repo))
        || (filter === 'installable' && plugin.installable)
        || plugin.tags.includes(filter)

      return matchesKeyword && matchesFilter
    })

    return [...result].sort((a, b) => {
      if (sortBy.value === 'author') {
        return a.author.localeCompare(b.author, 'zh-CN') || a.displayName.localeCompare(b.displayName, 'zh-CN')
      }

      if (sortBy.value === 'updated') {
        const dateA = a.updatedAtDate ? a.updatedAtDate.getTime() : 0
        const dateB = b.updatedAtDate ? b.updatedAtDate.getTime() : 0
        if (dateA !== dateB) return dateB - dateA
        return a.displayName.localeCompare(b.displayName, 'zh-CN')
      }

      if (sortBy.value === 'repo') {
        return Number(Boolean(b.repo)) - Number(Boolean(a.repo))
          || a.displayName.localeCompare(b.displayName, 'zh-CN')
      }

      if (sortBy.value === 'recommended') {
        return Number(b.installable) - Number(a.installable)
          || Number(Boolean(b.logo)) - Number(Boolean(a.logo))
          || a.displayName.localeCompare(b.displayName, 'zh-CN')
      }

      return a.displayName.localeCompare(b.displayName, 'zh-CN')
    })
  })

  const totalPages = computed(() => Math.max(1, Math.ceil(filteredPlugins.value.length / PAGE_SIZE)))

  const paginatedPlugins = computed(() => {
    const page = Math.min(currentPage.value, totalPages.value)
    const start = (page - 1) * PAGE_SIZE
    return filteredPlugins.value.slice(start, start + PAGE_SIZE)
  })

  watch(totalPages, (value) => {
    if (currentPage.value > value) currentPage.value = value
  })

  async function loadPlugins(url = registryUrl.value) {
    isLoading.value = true
    error.value = ''
    registryUrl.value = url || resolveRegistryUrl()

    try {
      const response = await fetch(registryUrl.value, { cache: 'no-store' })
      if (!response.ok) {
        throw new Error(`Registry request failed: HTTP ${response.status}`)
      }

      const payload = await response.json()
      plugins.value = normalizeRegistryPayload(payload)
    } catch (err) {
      plugins.value = []
      error.value = err instanceof Error ? err.message : 'Registry 加载失败'
    } finally {
      isLoading.value = false
    }
  }

  function setDarkMode(value) {
    isDarkMode.value = value
  }

  function setSearchQuery(query) {
    searchQuery.value = query || ''
  }

  function setSelectedTag(tag) {
    selectedTag.value = tag || 'all'
  }

  function setSortBy(value) {
    sortBy.value = value || 'recommended'
  }

  function setPage(value) {
    const page = Number(value)
    if (!Number.isFinite(page)) return
    currentPage.value = Math.min(Math.max(1, page), totalPages.value)
  }

  return {
    plugins,
    searchQuery,
    selectedTag,
    sortBy,
    currentPage,
    isDarkMode,
    isLoading,
    error,
    registryUrl,
    pageSize: PAGE_SIZE,
    allTags,
    hasRegistryTags,
    filterOptions,
    stats,
    filteredPlugins,
    paginatedPlugins,
    totalPages,
    loadPlugins,
    setDarkMode,
    setSearchQuery,
    setSelectedTag,
    setSortBy,
    setPage,
    toggleTheme
  }
})
