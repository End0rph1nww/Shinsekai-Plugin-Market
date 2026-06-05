<template>
  <div class="market-toolbar">
    <label class="market-search" aria-label="搜索插件">
      <n-icon class="market-search__icon"><search-outline /></n-icon>
      <input
        :value="searchQuery"
        type="search"
        placeholder="搜索 name / description / author / repo"
        @input="emit('update:searchQuery', $event.target.value)"
      />
      <button v-if="searchQuery" type="button" @click="emit('update:searchQuery', '')">清除</button>
    </label>

    <div class="market-toolbar__controls">
      <label>
        <span>筛选</span>
        <select :value="selectedTag" @change="emit('update:selectedTag', $event.target.value)">
          <option v-for="option in filterOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </label>

      <label>
        <span>排序</span>
        <select :value="sortBy" @change="emit('update:sortBy', $event.target.value)">
          <option value="name">名称</option>
          <option value="author">作者</option>
          <option value="updated">更新时间</option>
        </select>
      </label>
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
  sortBy: {
    type: String,
    default: 'name'
  },
  filterOptions: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:searchQuery', 'update:selectedTag', 'update:sortBy'])
</script>
