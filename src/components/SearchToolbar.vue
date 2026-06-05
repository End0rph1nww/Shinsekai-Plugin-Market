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

    <div class="market-filter-row" aria-label="插件筛选">
      <button
        v-for="option in filterOptions"
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
import { NIcon } from 'naive-ui'
import { SearchOutline } from '@vicons/ionicons5'

defineProps({
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
</script>
