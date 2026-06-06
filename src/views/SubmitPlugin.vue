<template>
  <div class="market-page">
    <app-header v-model="isDarkMode" />

    <main class="market-shell submit-shell">
      <section class="market-hero submit-hero">
        <p class="eyebrow">SHINSEKAI SYSTEM / SUBMIT PLUGIN</p>
        <h1>提交 Shinsekai 插件</h1>
        <p class="market-hero__lead">
          作者继续用 GitHub 管理源码；市场只生成 Registry Issue 需要的 JSON。
        </p>
      </section>

      <section class="submit-wizard" aria-label="Plugin submission wizard">
        <div class="submit-wizard__form">
          <div class="submit-panel">
            <div class="submit-panel__head">
              <p class="eyebrow">STEP 01</p>
              <h2>基础信息</h2>
            </div>

            <div class="submit-grid">
              <label class="submit-field" :class="{ invalid: fieldErrors.display_name }">
                <span>展示名称</span>
                <input v-model.trim="form.display_name" type="text" placeholder="Shinsekai Plugin" />
                <small v-if="fieldErrors.display_name">{{ fieldErrors.display_name }}</small>
              </label>

              <label class="submit-field" :class="{ invalid: fieldErrors.author }">
                <span>作者</span>
                <input v-model.trim="form.author" type="text" placeholder="Shinsekai Contributors" />
                <small v-if="fieldErrors.author">{{ fieldErrors.author }}</small>
              </label>
            </div>

            <label class="submit-field submit-field--wide" :class="{ invalid: fieldErrors.desc }">
              <span>短摘要 <b>{{ descLength }}/{{ maxDescLength }}</b></span>
              <textarea v-model="form.desc" rows="3" placeholder="一句话说明插件能力、适用场景或特色。" />
              <small v-if="fieldErrors.desc">{{ fieldErrors.desc }}</small>
            </label>
          </div>

          <div class="submit-panel">
            <div class="submit-panel__head">
              <p class="eyebrow">STEP 02</p>
              <h2>仓库与入口</h2>
            </div>

            <label class="submit-field submit-field--wide" :class="{ invalid: fieldErrors.repo }">
              <span>GitHub 仓库 URL</span>
              <input v-model.trim="form.repo" type="url" placeholder="https://github.com/shinsekai/plugin-example" />
              <small v-if="fieldErrors.repo">{{ fieldErrors.repo }}</small>
            </label>

            <label class="submit-field submit-field--wide" :class="{ invalid: fieldErrors.entry }">
              <span>插件入口</span>
              <input v-model.trim="form.entry" type="text" placeholder="plugins.shinsekai_plugin.plugin:ShinsekaiPlugin" />
              <small v-if="fieldErrors.entry">{{ fieldErrors.entry }}</small>
            </label>

            <div class="submit-grid">
              <label class="submit-field" :class="{ invalid: fieldErrors.tags }">
                <span>标签</span>
                <input v-model="form.tags" type="text" placeholder="shinsekai, example" />
                <small v-if="fieldErrors.tags">{{ fieldErrors.tags }}</small>
              </label>

              <label class="submit-field">
                <span>社交链接</span>
                <input v-model.trim="form.social_link" type="url" placeholder="https://github.com/shinsekai" />
              </label>
            </div>
          </div>
        </div>

        <aside class="submit-preview">
          <div class="submit-panel submit-panel--sticky">
            <div class="submit-panel__head submit-panel__head--with-actions">
              <div>
                <p class="eyebrow">STEP 03</p>
                <h2>提交 JSON</h2>
              </div>
              <div class="submit-actions submit-actions--header">
                <n-button secondary @click="copyJson">
                  <template #icon>
                    <n-icon><copy :size="15" /></n-icon>
                  </template>
                  复制 JSON
                </n-button>
                <n-button type="primary" :disabled="!isValid" @click="openIssue">
                  <template #icon>
                    <n-icon><external-link :size="15" /></n-icon>
                  </template>
                  打开 Issue
                </n-button>
              </div>
            </div>

            <div class="submit-status" :class="isValid ? 'is-ready' : 'is-blocked'">
              <check-circle v-if="isValid" :size="18" />
              <alert-circle v-else :size="18" />
              <span>{{ isValid ? '可以提交' : '等待修正' }}</span>
            </div>

            <pre class="submit-json">{{ submissionJson }}</pre>

            <div v-if="validationList.length" class="submit-errors">
              <p v-for="item in validationList" :key="item">{{ item }}</p>
            </div>
          </div>
        </aside>
      </section>
    </main>

    <app-footer />
  </div>
</template>

<script setup>
import { computed, reactive } from 'vue'
import { storeToRefs } from 'pinia'
import { NButton, NIcon, useMessage } from 'naive-ui'
import { AlertCircle, CheckCircle, Copy, ExternalLink } from '@lucide/vue'
import AppHeader from '../components/AppHeader.vue'
import AppFooter from '../components/AppFooter.vue'
import { usePluginStore } from '../stores/plugins'
import {
  MAX_SUBMISSION_DESC_LENGTH,
  SUBMIT_PLUGIN_URL,
  buildSubmissionIssueUrl,
  buildSubmissionJson,
  isValidGithubRepoUrl
} from '../utils/pluginNormalizer'

const store = usePluginStore()
const { isDarkMode } = storeToRefs(store)
const message = useMessage()
const submitUrl = import.meta.env.VITE_SUBMIT_URL || SUBMIT_PLUGIN_URL
const maxDescLength = MAX_SUBMISSION_DESC_LENGTH

const form = reactive({
  display_name: '',
  desc: '',
  author: '',
  repo: '',
  entry: '',
  tags: '',
  social_link: ''
})

const descLength = computed(() => Array.from(form.desc || '').length)
const tagList = computed(() => form.tags.split(/[,，、\s]+/).map(tag => tag.trim()).filter(Boolean))

const fieldErrors = computed(() => {
  const errors = {}
  if (!form.display_name) errors.display_name = '需要展示名称。'
  if (!form.author) errors.author = '需要作者名。'
  if (!form.desc) errors.desc = '需要短摘要。'
  if (descLength.value > maxDescLength) errors.desc = `短摘要最多 ${maxDescLength} 字符。`
  if (!form.repo) errors.repo = '需要 GitHub 仓库 URL。'
  else if (!isValidGithubRepoUrl(form.repo)) errors.repo = '仓库必须是 https://github.com/owner/repo。'
  if (!form.entry) errors.entry = '需要插件入口。'
  if (tagList.value.length > 5) errors.tags = '标签最多 5 个。'
  return errors
})

const validationList = computed(() => Object.values(fieldErrors.value))
const isValid = computed(() => validationList.value.length === 0)
const submissionJson = computed(() => buildSubmissionJson({ ...form, tags: tagList.value }))
const issueUrl = computed(() => buildSubmissionIssueUrl({ ...form, tags: tagList.value }, submitUrl))

async function copyJson() {
  try {
    await navigator.clipboard.writeText(`\`\`\`json\n${submissionJson.value}\n\`\`\``)
    message.success('已复制提交 JSON')
  } catch (_) {
    message.error('复制失败，请手动复制预览内容')
  }
}

function openIssue() {
  if (!isValid.value) return
  window.open(issueUrl.value, '_blank', 'noopener,noreferrer')
}
</script>
