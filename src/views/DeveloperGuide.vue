<template>
  <div class="market-page">
    <app-header v-model="isDarkMode" />

    <main class="market-shell docs-shell">
      <section class="market-hero docs-hero">
        <p class="eyebrow">SHINSEKAI SYSTEM / PLUGIN DEV</p>
        <h1>Shinsekai 插件开发文档</h1>
        <p class="market-hero__lead">
          用 GitHub 管理源码，用 Registry CI 推断入口、打包、查验并同步到 R2。作者只需要保持仓库结构清楚，基础信息准确。
        </p>
      </section>

      <section class="docs-overview" aria-label="Plugin distribution flow">
        <article v-for="item in flowItems" :key="item.title" class="docs-flow-card">
          <component :is="item.icon" :size="20" />
          <strong>{{ item.title }}</strong>
          <span>{{ item.text }}</span>
        </article>
      </section>

      <section class="docs-layout">
        <aside class="docs-toc" aria-label="Developer guide navigation">
          <a v-for="item in tocItems" :key="item.href" :href="item.href">{{ item.label }}</a>
        </aside>

        <article class="docs-article">
          <section id="quick-start" class="docs-section">
            <p class="eyebrow">01 / START</p>
            <h2>最小仓库结构</h2>
            <p>
              推荐把插件源码放在一个小写下划线目录里。这个目录名会参与 CI 的 entry 推断，也会成为安装后的包目录。
            </p>
            <pre><code>{{ repoTree }}</code></pre>
            <div class="docs-note">
              <strong>目录名规则</strong>
              <span>使用 Python 可导入的名字，例如 <code>cloud_tts</code>、<code>playwright_browser</code>。避免空格、中文、连字符和特殊符号。</span>
            </div>
          </section>

          <section id="plugin-class" class="docs-section">
            <p class="eyebrow">02 / PLUGIN.PY</p>
            <h2>插件类规范</h2>
            <p>
              当前 Shinsekai 运行时核心是 <code>PluginBase</code>。插件必须提供 <code>plugin_id</code> 和 <code>initialize()</code>，展示名、版本、简介、作者建议都写成属性。
            </p>
            <pre><code>{{ pluginExample }}</code></pre>
            <dl class="docs-field-grid">
              <div>
                <dt>plugin_id</dt>
                <dd>稳定唯一 ID。建议使用 <code>com.shinsekai.xxx</code> 或作者域名反写。</dd>
              </div>
              <div>
                <dt>plugin_name</dt>
                <dd>软件内展示名。CI 也会优先读取它生成市场展示名。</dd>
              </div>
              <div>
                <dt>plugin_version</dt>
                <dd>插件版本。发布新包时请同步更新，方便用户理解更新内容。</dd>
              </div>
              <div>
                <dt>plugin_root</dt>
                <dd>运行时数据目录，不是源码目录。持久化配置请写到这里。</dd>
              </div>
            </dl>
          </section>

          <section id="entry" class="docs-section">
            <p class="eyebrow">03 / ENTRY</p>
            <h2>entry 由 CI 自动推断</h2>
            <p>
              作者提交插件时不需要手填 <code>entry</code>。Registry CI 会克隆插件仓库，寻找 <code>plugin.py</code>，读取继承
              <code>PluginBase</code> 的插件类，然后生成最终 registry 条目。
            </p>
            <div class="docs-steps">
              <span>查找 <code>plugin.py</code></span>
              <span>读取 <code>PluginBase</code> 子类</span>
              <span>生成 <code>plugins.package.plugin:ClassName</code></span>
              <span>写入 Registry PR</span>
            </div>
            <div class="docs-note docs-note--warn">
              <strong>如果推断失败</strong>
              <span>优先检查目录名是否可导入、<code>plugin.py</code> 是否在仓库根目录或一级包目录内、插件类是否继承 <code>PluginBase</code>。</span>
            </div>
          </section>

          <section id="assets" class="docs-section">
            <p class="eyebrow">04 / ASSETS</p>
            <h2>依赖、Logo 与文档</h2>
            <div class="docs-checklist">
              <p><check-circle :size="16" /> 依赖写入 <code>requirements.txt</code>，安装时由客户端执行。</p>
              <p><check-circle :size="16" /> Logo 放在仓库根目录或 <code>assets/</code>、<code>static/</code>、<code>public/</code>、<code>resources/</code>、<code>images/</code>、<code>img/</code>。</p>
              <p><check-circle :size="16" /> Logo 文件名使用 <code>logo.png</code>、<code>logo.jpg</code>、<code>logo.jpeg</code> 或 <code>logo.webp</code>。</p>
              <p><check-circle :size="16" /> 建议提供 <code>README.md</code>，写清功能、配置方式、依赖来源和风险提示。</p>
            </div>
            <p>
              CI 会把合法 Logo 上传到 R2 的 <code>assets/&lt;owner&gt;/&lt;plugin&gt;/&lt;version&gt;/</code> 路径，包体会上传到
              <code>plugins/&lt;owner&gt;/&lt;plugin&gt;/&lt;version&gt;/</code> 路径。
            </p>
          </section>

          <section id="submit" class="docs-section">
            <p class="eyebrow">05 / PUBLISH</p>
            <h2>发布流程</h2>
            <div class="docs-pipeline">
              <div>
                <strong>作者提交</strong>
                <span>在市场提交页填写展示名、作者、简介、GitHub 仓库、标签和社交链接。</span>
              </div>
              <div>
                <strong>CI 建 PR</strong>
                <span>Registry CI 读取 Issue JSON，自动推断 entry、补齐 registry 条目并创建维护者审核 PR。</span>
              </div>
              <div>
                <strong>维护者合并</strong>
                <span>默认上架为 Community。人工安全复核可以之后单独申请 Verified。</span>
              </div>
              <div>
                <strong>R2 分发</strong>
                <span>发布工作流打包源码、计算 SHA256、上传 R2，并刷新插件索引。</span>
              </div>
            </div>
            <pre><code>{{ submissionExample }}</code></pre>
          </section>

          <section id="runtime" class="docs-section">
            <p class="eyebrow">06 / RUNTIME</p>
            <h2>运行时与能力注册</h2>
            <p>
              插件启用后，宿主会把它写入 <code>data/config/plugins.yaml</code>。运行时从这里读取 entry，再导入插件类并调用
              <code>initialize(register, plugin_root, host)</code>。
            </p>
            <div class="docs-capabilities">
              <span>LLM Adapter</span>
              <span>TTS / ASR / T2I Adapter</span>
              <span>LLM Tool</span>
              <span>消息处理器</span>
              <span>React 配置页</span>
              <span>iframe 前端页</span>
              <span>Chat UI 扩展</span>
              <span>Workflow / Output Contract</span>
            </div>
            <div class="docs-note">
              <strong>React 页面建议</strong>
              <span>新插件如果需要在当前前端里显示配置页，优先使用 <code>FrontendConfigContribution</code> 或 <code>FrontendPageContribution</code>。</span>
            </div>
          </section>

          <section id="safety" class="docs-section">
            <p class="eyebrow">07 / SAFETY</p>
            <h2>安全与可维护性</h2>
            <div class="docs-checklist docs-checklist--danger">
              <p><shield-check :size="16" /> 不提交 token、Cookie、<code>.env</code>、账号配置、缓存、虚拟环境或构建临时目录。</p>
              <p><shield-check :size="16" /> 不在安装阶段执行与插件无关的系统修改。</p>
              <p><shield-check :size="16" /> 网络请求、文件读写和外部命令需要在 README 中说明原因。</p>
              <p><shield-check :size="16" /> Community 表示通过基础 CI 检查，不代表已完成完整安全审计。</p>
            </div>
          </section>
        </article>
      </section>
    </main>

    <app-footer />
  </div>
</template>

<script setup>
import { markRaw } from 'vue'
import { storeToRefs } from 'pinia'
import { BookOpen, CheckCircle, GitPullRequest, PackageCheck, ShieldCheck } from '@lucide/vue'
import AppHeader from '../components/AppHeader.vue'
import AppFooter from '../components/AppFooter.vue'
import { usePluginStore } from '../stores/plugins'

const store = usePluginStore()
const { isDarkMode } = storeToRefs(store)

const flowItems = [
  {
    icon: markRaw(BookOpen),
    title: '写插件',
    text: '仓库保留源码、README、requirements 与可选 Logo。'
  },
  {
    icon: markRaw(GitPullRequest),
    title: '提 Issue',
    text: '市场生成 JSON，Registry CI 自动创建审核 PR。'
  },
  {
    icon: markRaw(PackageCheck),
    title: '打包同步',
    text: '合并后打包、查验、计算 hash，并发布到 R2。'
  },
  {
    icon: markRaw(ShieldCheck),
    title: '分级信任',
    text: '默认 Community，后续可单独申请 Verified。'
  }
]

const tocItems = [
  { href: '#quick-start', label: '最小结构' },
  { href: '#plugin-class', label: '插件类' },
  { href: '#entry', label: '入口推断' },
  { href: '#assets', label: '依赖与 Logo' },
  { href: '#submit', label: '发布流程' },
  { href: '#runtime', label: '运行时' },
  { href: '#safety', label: '安全规范' }
]

const repoTree = `shinsekai-plugin-example/
  example_plugin/
    __init__.py
    plugin.py
    requirements.txt
    README.md
    logo.png`

const pluginExample = `from pathlib import Path

from sdk.plugin import PluginBase
from sdk.plugin_host_context import PluginHostContext
from sdk.register import PluginCapabilityRegistry


class ExamplePlugin(PluginBase):
    @property
    def plugin_id(self) -> str:
        return "com.shinsekai.example_plugin"

    @property
    def plugin_version(self) -> str:
        return "0.1.0"

    @property
    def plugin_name(self) -> str:
        return "Shinsekai Example"

    @property
    def plugin_description(self) -> str:
        return "示例插件，用于演示基础结构。"

    @property
    def plugin_author(self) -> str:
        return "Shinsekai Contributors"

    def initialize(
        self,
        register: PluginCapabilityRegistry,
        plugin_root: Path,
        host: PluginHostContext,
    ) -> None:
        plugin_root.mkdir(parents=True, exist_ok=True)
        # 在这里注册 adapter、tool、前端配置页或消息处理器。`

const submissionExample = `{
  "display_name": "Shinsekai Example",
  "desc": "面向 Shinsekai 的示例插件，说明核心能力和适用场景。",
  "author": "Shinsekai Contributors",
  "repo": "https://github.com/shinsekai/plugin-example",
  "shinsekai_version": ">=0.2.0",
  "tags": ["example"],
  "social_link": "https://github.com/shinsekai"
}`
</script>
