<template>
  <article class="plugin-card" @click="emit('select', plugin)">
    <div class="plugin-card__main">
      <div class="plugin-card__logo" aria-hidden="true">
        <img v-if="plugin.logo" :src="plugin.logo" :alt="`${plugin.displayName} logo`" />
        <span v-else>{{ initials }}</span>
      </div>

      <div class="plugin-card__content">
        <div class="plugin-card__title-row">
          <h3>{{ plugin.displayName }}</h3>
          <span v-if="plugin.installable" class="recommend-badge">可安装</span>
        </div>

        <div class="plugin-card__meta">
          <span>{{ plugin.author }}</span>
          <span>{{ plugin.version }}</span>
        </div>

        <p>{{ plugin.description }}</p>
      </div>
    </div>

    <div class="plugin-card__foot">
      <div class="plugin-card__tags">
        <span v-for="tag in visibleTags" :key="tag" class="market-chip">{{ tag }}</span>
        <span v-if="extraTagCount > 0" class="market-chip market-chip--muted">+{{ extraTagCount }}</span>
      </div>

      <div class="plugin-card__actions">
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

const visibleTags = computed(() => props.plugin.tags.slice(0, 3))
const extraTagCount = computed(() => Math.max(0, props.plugin.tags.length - visibleTags.value.length))
</script>
