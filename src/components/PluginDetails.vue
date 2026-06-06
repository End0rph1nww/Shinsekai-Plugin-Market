<template>
  <n-drawer v-model:show="visible" :width="drawerWidth" placement="right">
    <n-drawer-content v-if="plugin" class="plugin-detail" closable>
      <template #header>
        <div class="plugin-detail__header">
          <div class="plugin-detail__logo">
            <img :src="plugin.logo || '/plugin-market-logo.png'" :alt="`${plugin.displayName} logo`" />
          </div>
          <div>
            <p class="eyebrow">PLUGIN DETAIL</p>
            <h2>{{ plugin.displayName }}</h2>
            <p>{{ plugin.description }}</p>
          </div>
        </div>
      </template>

      <div class="plugin-detail__section">
        <h3>基础信息</h3>
        <dl class="detail-grid">
          <div><dt>注册名</dt><dd>{{ plugin.name }}</dd></div>
          <div><dt>作者</dt><dd>{{ plugin.author }}</dd></div>
          <div><dt>版本</dt><dd>{{ plugin.version }}</dd></div>
          <div><dt>Shinsekai 版本</dt><dd>{{ plugin.shinsekaiVersion || '未标注' }}</dd></div>
          <div><dt>入口</dt><dd>{{ plugin.entry || '未标注' }}</dd></div>
          <div><dt>更新时间</dt><dd>{{ plugin.updatedAt || '未标注' }}</dd></div>
        </dl>
      </div>

      <div class="plugin-detail__section">
        <h3>Package 信息</h3>
        <dl class="detail-grid detail-grid--wide">
          <div><dt>来源</dt><dd>{{ sourceLabel }}</dd></div>
          <div><dt>包大小</dt><dd>{{ packageSizeLabel }}</dd></div>
          <div><dt>Package URL</dt><dd>{{ plugin.packageUrl || '未提供' }}</dd></div>
          <div><dt>Commit SHA</dt><dd>{{ compactCommitSha }}<small v-if="plugin.commitSha">{{ plugin.commitSha }}</small></dd></div>
          <div><dt>SHA256</dt><dd>{{ compactPackageSha }}<small v-if="plugin.packageSha256">{{ plugin.packageSha256 }}</small></dd></div>
          <div><dt>R2 Key</dt><dd>{{ plugin.packageR2Key || '未提供' }}</dd></div>
        </dl>
      </div>

      <div class="plugin-detail__section">
        <h3>安全扫描</h3>
        <div class="scan-summary" :class="`scan-summary--${plugin.scanState}`">
          <shield-check :size="18" />
          <strong>{{ scanLabel }}</strong>
          <span>{{ plugin.scanMessage || '暂无扫描摘要。' }}</span>
        </div>
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
          <n-button v-if="plugin.packageUrl" secondary tag="a" :href="plugin.packageUrl" target="_blank" rel="noreferrer">下载包</n-button>
          <n-button v-if="plugin.repoUrl" secondary tag="a" :href="plugin.repoUrl" target="_blank" rel="noreferrer">GitHub 仓库</n-button>
        </div>
      </template>
    </n-drawer-content>
  </n-drawer>
</template>

<script setup>
import { computed } from 'vue'
import { NButton, NDrawer, NDrawerContent, useMessage } from 'naive-ui'
import { ShieldCheck } from '@lucide/vue'
import { buildInstallInfo, compactHash, formatBytes } from '../utils/pluginNormalizer'

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

const drawerWidth = computed(() => (window.innerWidth < 720 ? '100%' : 600))
const sourceLabel = computed(() => {
  if (props.plugin?.packageSource === 'r2') return 'R2 官方包'
  if (props.plugin?.packageHasOfficialUrl) return '官方安装包'
  return 'GitHub 仓库'
})
const packageSizeLabel = computed(() => formatBytes(props.plugin?.packageSize ?? props.plugin?.size))
const compactCommitSha = computed(() => compactHash(props.plugin?.commitSha))
const compactPackageSha = computed(() => compactHash(props.plugin?.packageSha256 || props.plugin?.sha256))
const scanLabel = computed(() => {
  if (props.plugin?.scanState === 'passed') return '扫描通过'
  if (props.plugin?.scanState === 'blocked') return '扫描拦截'
  return '未扫描'
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
