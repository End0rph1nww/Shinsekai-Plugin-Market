<template>
  <n-drawer v-model:show="visible" :width="drawerWidth" placement="right">
    <n-drawer-content v-if="plugin" class="plugin-detail" closable>
      <template #header>
        <div class="plugin-detail__header">
          <div class="plugin-detail__logo">
            <img v-if="plugin.logo" :src="plugin.logo" :alt="`${plugin.displayName} logo`" />
            <span v-else>{{ initials }}</span>
          </div>
          <div>
            <p class="eyebrow">PLUGIN DETAIL / {{ plugin.name }}</p>
            <h2>{{ plugin.displayName }}</h2>
            <p>{{ plugin.description }}</p>
          </div>
        </div>
      </template>

      <div class="plugin-detail__section">
        <h3>基础信息</h3>
        <dl class="detail-grid">
          <div><dt>作者</dt><dd>{{ plugin.author }}</dd></div>
          <div><dt>版本</dt><dd>{{ plugin.version }}</dd></div>
          <div><dt>Shinsekai 版本</dt><dd>{{ plugin.shinsekaiVersion || '未标注' }}</dd></div>
          <div><dt>入口</dt><dd>{{ plugin.entry || '未标注' }}</dd></div>
          <div><dt>更新时间</dt><dd>{{ plugin.updatedAt || '未标注' }}</dd></div>
          <div><dt>包大小</dt><dd>{{ formattedSize }}</dd></div>
        </dl>
      </div>

      <div class="plugin-detail__section">
        <h3>Registry 字段</h3>
        <dl class="detail-grid detail-grid--wide">
          <div><dt>Repository</dt><dd>{{ plugin.repo || '未提供' }}</dd></div>
          <div><dt>Download URL</dt><dd>{{ plugin.downloadUrl || '未提供' }}</dd></div>
          <div><dt>Commit SHA</dt><dd>{{ plugin.commitSha || '未提供' }}</dd></div>
          <div><dt>SHA256</dt><dd>{{ plugin.sha256 || '未提供' }}</dd></div>
        </dl>
      </div>

      <div class="plugin-detail__section">
        <h3>标签</h3>
        <div class="plugin-detail__tags">
          <span v-for="tag in plugin.tags" :key="tag" class="market-chip">{{ tag }}</span>
          <span v-if="plugin.tags.length === 0" class="muted">暂无标签</span>
        </div>
      </div>

      <template #footer>
        <div class="plugin-detail__actions">
          <n-button secondary @click="copyInstallInfo">复制安装信息</n-button>
          <n-button v-if="plugin.repoUrl" secondary tag="a" :href="plugin.repoUrl" target="_blank" rel="noreferrer">GitHub 仓库</n-button>
          <n-button type="primary" tag="a" href="https://github.com/RachelForster/Shinsekai-Plugin-Registry/issues/new" target="_blank" rel="noreferrer">提交插件</n-button>
        </div>
      </template>
    </n-drawer-content>
  </n-drawer>
</template>

<script setup>
import { computed } from 'vue'
import { NButton, NDrawer, NDrawerContent, useMessage } from 'naive-ui'
import { buildInstallInfo } from '../utils/pluginNormalizer'

const props = defineProps({
  show: Boolean,
  plugin: Object
})

const emit = defineEmits(['update:show'])
const message = useMessage()

const visible = computed({
  get: () => props.show,
  set: value => emit('update:show', value)
})

const drawerWidth = computed(() => (window.innerWidth < 720 ? '100%' : 560))

const initials = computed(() => {
  return (props.plugin?.displayName || props.plugin?.name || 'S').slice(0, 2).toUpperCase()
})

const formattedSize = computed(() => {
  const size = Number(props.plugin?.size)
  if (!Number.isFinite(size) || size <= 0) return '未标注'
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
  return `${(size / 1024 / 1024).toFixed(1)} MB`
})

async function copyInstallInfo() {
  if (!props.plugin) return
  try {
    await navigator.clipboard.writeText(buildInstallInfo(props.plugin))
    message.success('已复制安装信息')
  } catch (_) {
    message.error('复制失败，请手动复制详情字段')
  }
}
</script>
