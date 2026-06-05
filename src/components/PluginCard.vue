<template>
  <article class="plugin-card" @click="emit('select', plugin)">
    <div class="plugin-card__logo" aria-hidden="true">
      <img v-if="plugin.logo" :src="plugin.logo" :alt="`${plugin.displayName} logo`" />
      <span v-else>{{ initials }}</span>
    </div>

    <div class="plugin-card__body">
      <div class="plugin-card__title-row">
        <h3>{{ plugin.displayName }}</h3>
        <span class="plugin-card__name">{{ plugin.name }}</span>
      </div>
      <p>{{ plugin.description }}</p>
      <div class="plugin-card__meta">
        <span>作者：{{ plugin.author }}</span>
        <span v-if="plugin.entry">入口：{{ plugin.entry }}</span>
      </div>
      <div class="plugin-card__tags">
        <span v-for="tag in visibleTags" :key="tag" class="market-chip">{{ tag }}</span>
      </div>
    </div>

    <div class="plugin-card__status">
      <span class="status-pill">{{ plugin.version }}</span>
      <span class="status-text">{{ plugin.updatedAt || '未标注更新时间' }}</span>
      <a
        v-if="plugin.repoUrl"
        class="repo-link"
        :href="plugin.repoUrl"
        target="_blank"
        rel="noreferrer"
        @click.stop
      >
        仓库
      </a>
      <button type="button" @click.stop="emit('select', plugin)">详情</button>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  plugin: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['select'])

const initials = computed(() => {
  return (props.plugin.displayName || props.plugin.name || 'S').slice(0, 2).toUpperCase()
})

const visibleTags = computed(() => props.plugin.tags.slice(0, 4))
</script>
