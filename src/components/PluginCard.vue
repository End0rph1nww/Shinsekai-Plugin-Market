<template>
  <article class="plugin-card" tabindex="0" @click="emit('select', plugin)" @keydown.enter="emit('select', plugin)">
    <div class="plugin-card__main">
      <div class="plugin-card__logo" aria-hidden="true">
        <img :src="plugin.logo || '/plugin-market-logo.png'" :alt="`${plugin.displayName} logo`" />
      </div>

      <div class="plugin-card__content">
        <div class="plugin-card__title-row">
          <h3>{{ plugin.displayName }}</h3>
          <span :class="trustClass">
            <shield-check :size="12" />{{ trustBadgeLabel }}
          </span>
        </div>

        <p>{{ plugin.shortDescription || plugin.description }}</p>
      </div>
    </div>

    <div class="plugin-card__meta-panel" aria-label="Plugin metadata">
      <div class="plugin-card__meta-line">
        <span><user-round :size="13" />{{ plugin.author }}</span>
        <span><git-branch :size="13" />{{ versionLabel }}</span>
        <span v-if="plugin.packageHasOfficialUrl"><archive :size="13" />{{ packageLabel }}</span>
        <span v-if="plugin.packageSize"><hard-drive :size="13" />{{ packageSizeLabel }}</span>
        <span><star :size="13" />{{ starLabel }}</span>
      </div>
      <div class="plugin-card__status-line">
        <span :class="scanClass"><shield-check :size="13" />{{ scanLabel }}</span>
        <span :class="reviewClass"><shield-check :size="13" />{{ reviewLabel }}</span>
      </div>
    </div>

    <div class="plugin-card__foot">
      <div class="plugin-card__tags">
        <span v-for="tag in visibleTags" :key="tag" class="market-chip">
          <tag-icon :size="12" />{{ tag }}
        </span>
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
          <svg class="github-mark" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
          </svg>
          仓库
        </a>
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'
import { Archive, GitBranch, HardDrive, ShieldCheck, Star, Tag as TagIcon, UserRound } from '@lucide/vue'
import { formatBytes } from '../utils/pluginNormalizer'

const props = defineProps({
  plugin: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['select'])

const versionLabel = computed(() => props.plugin.version && props.plugin.version !== '未标注' ? props.plugin.version : '未标注')
const starLabel = computed(() => props.plugin.stars > 0 ? props.plugin.stars.toLocaleString() : '0')
const packageLabel = computed(() => props.plugin.packageSource === 'r2' ? 'R2 包' : '安装包')
const packageSizeLabel = computed(() => formatBytes(props.plugin.packageSize))
const scanLabel = computed(() => {
  if (props.plugin.scanState === 'passed') return '自动通过'
  if (props.plugin.scanState === 'blocked') return '自动拦截'
  return '未自动检查'
})
const scanClass = computed(() => ['plugin-card__status-chip', 'plugin-card__scan', `plugin-card__scan--${props.plugin.scanState || 'unknown'}`])
const trustBadgeState = computed(() => props.plugin.trustState || 'community')
const trustBadgeLabel = computed(() => {
  if (trustBadgeState.value === 'verified') return 'Verified'
  if (trustBadgeState.value === 'pending') return 'Pending'
  if (trustBadgeState.value === 'blocked') return 'Blocked'
  return 'Community'
})
const trustClass = computed(() => ['trust-badge', `trust-badge--${trustBadgeState.value}`])
const reviewLabel = computed(() => {
  if (props.plugin.trustState === 'verified') return '人工通过'
  if (props.plugin.trustState === 'pending') return '更新待复审'
  if (props.plugin.trustState === 'blocked') return '审查拦截'
  return '未人工审查'
})
const reviewClass = computed(() => ['plugin-card__status-chip', 'plugin-card__review', `plugin-card__review--${props.plugin.trustState || 'community'}`])
const visibleTags = computed(() => props.plugin.tags.slice(0, 3))
const extraTagCount = computed(() => Math.max(0, props.plugin.tags.length - visibleTags.value.length))
</script>
