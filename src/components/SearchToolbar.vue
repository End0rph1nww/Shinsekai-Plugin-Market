<template>
  <div class="market-toolbar">
    <label class="market-search" aria-label="搜索插件">
      <n-icon class="market-search__icon"><search-outline /></n-icon>
      <input
        :value="searchQuery"
        type="search"
        placeholder="搜索插件、作者、仓库..."
        @input="emit('update:searchQuery', $event.target.value)"
      />
      <button v-if="searchQuery" type="button" @click="emit('update:searchQuery', '')">清除</button>
    </label>

    <div v-if="visibleFilterOptions.length > 0" class="market-filter-row" aria-label="插件筛选">
      <button
        v-for="option in visibleFilterOptions"
        :key="option.value"
        type="button"
        class="market-filter-chip"
        :class="{ active: selectedTag === option.value }"
        @click="emit('update:selectedTag', option.value)"
      >
        {{ option.label }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { NIcon } from 'naive-ui'
import { SearchOutline } from '@vicons/ionicons5'

const props = defineProps({
  searchQuery: {
    type: String,
    default: ''
  },
  selectedTag: {
    type: String,
    default: 'all'
  },
  filterOptions: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:searchQuery', 'update:selectedTag'])

const visibleFilterOptions = computed(() => {
  return props.filterOptions.filter(option => option.value !== 'all')
})
</script>
