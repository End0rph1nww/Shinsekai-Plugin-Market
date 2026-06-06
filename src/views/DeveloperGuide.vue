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
              推荐把 <code>plugin.py</code>、<code>requirements.txt</code>、<code>README.md</code> 和 <code>logo.png</code>
              放在仓库根目录。Registry CI 会克隆 GitHub 仓库，扫描根目录的 <code>plugin.py</code>，并用仓库名生成插件名、entry
              和安装目录。
            </p>
            <pre><code>{{ repoTree }}</code></pre>
            <div class="docs-note">
              <strong>目录名规则</strong>
              <span>仓库名会转成小写下划线，例如 <code>Shinsekai-Plugin-Market</code> 会变成 <code>shinsekai_plugin_market</code>。复杂项目可以把辅助模块放进子目录，但入口 <code>plugin.py</code> 仍建议放在仓库根目录。</span>
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
              作者提交插件时不需要手填 <code>entry</code>。Registry CI 会克隆插件仓库，寻找最靠近仓库根目录的
              <code>plugin.py</code>，读取继承 <code>PluginBase</code> 的插件类，然后生成最终 registry 条目。
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
            <div class="docs-checklist docs-checklist--assets">
              <p><package :size="16" /> 依赖写入 <code>requirements.txt</code>，安装时由客户端执行。</p>
              <p><image-icon :size="16" /> Logo 放在仓库根目录或 <code>assets/</code>、<code>static/</code>、<code>public/</code>、<code>resources/</code>、<code>images/</code>、<code>img/</code>。</p>
              <p><image-icon :size="16" /> Logo 文件名使用 <code>logo.png</code>、<code>logo.jpg</code>、<code>logo.jpeg</code> 或 <code>logo.webp</code>。</p>
              <p><file-text :size="16" /> 建议提供 <code>README.md</code>，写清功能、配置方式、依赖来源和风险提示。</p>
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

          <section id="api-overview" class="docs-section">
            <p class="eyebrow">07 / API</p>
            <h2>能力注册接口</h2>
            <p>
              <code>initialize()</code> 里的 <code>register</code> 是插件接入宿主的主要入口。下面这些接口来自当前 SDK，文档只列推荐公开用法。
            </p>
            <div class="docs-api-table">
              <div v-for="row in capabilityRows" :key="row.method" class="docs-api-row">
                <code>{{ row.method }}</code>
                <strong>{{ row.title }}</strong>
                <span>{{ row.text }}</span>
              </div>
            </div>
          </section>

          <section id="llm-tools" class="docs-section">
            <p class="eyebrow">08 / LLM TOOLS</p>
            <h2>注册 LLM 工具</h2>
            <p>
              推荐使用 <code>sdk.tool_registry.tool</code> 装饰器。工具模块需要在 <code>initialize()</code> 里被导入一次，装饰器才会登记到全局工具表。
            </p>
            <pre><code>{{ toolExample }}</code></pre>
            <div class="docs-note">
              <strong>工具返回值</strong>
              <span>返回可 JSON 序列化的对象。耗时模型未就绪时，可以抛出 <code>ToolNotReady</code>，宿主会转换成加载中状态。</span>
            </div>
          </section>

          <section id="adapters" class="docs-section">
            <p class="eyebrow">09 / ADAPTERS</p>
            <h2>注册 Adapter 后端</h2>
            <p>
              Adapter 用来扩展 LLM、TTS、ASR、T2I 后端。类需要继承 <code>sdk.adapters</code> 下对应基类，再通过 register 方法挂到宿主。
            </p>
            <pre><code>{{ adapterExample }}</code></pre>
            <div class="docs-note docs-note--warn">
              <strong>依赖重量</strong>
              <span>ASR、视觉、浏览器这类重依赖请写进 <code>requirements.txt</code>，并在 README 里说明下载体积、模型缓存和硬件要求。</span>
            </div>
          </section>

          <section id="frontend-config" class="docs-section">
            <p class="eyebrow">10 / CONFIG UI</p>
            <h2>React 配置页</h2>
            <p>
              现在主程序前端可以直接渲染 <code>FrontendConfigContribution</code>。它由 schema、读取函数和保存函数组成，适合插件设置项。
            </p>
            <pre><code>{{ frontendConfigExample }}</code></pre>
            <div class="docs-capabilities">
              <span>text</span>
              <span>select</span>
              <span>boolean</span>
              <span>number</span>
              <span>textarea</span>
              <span>json</span>
              <span>file</span>
              <span>password</span>
              <span>url</span>
            </div>
          </section>

          <section id="frontend-page" class="docs-section">
            <p class="eyebrow">11 / FRONTEND PAGE</p>
            <h2>插件自带前端页面</h2>
            <p>
              如果插件需要完整交互界面，可以把构建后的 <code>frontend/dist/index.html</code> 交给 <code>FrontendPageContribution</code>。
              宿主会把该目录作为受限静态资源挂载，并以 iframe 打开。
            </p>
            <pre><code>{{ frontendPageExample }}</code></pre>
          </section>

          <section id="context" class="docs-section">
            <p class="eyebrow">12 / CONTEXT</p>
            <h2>上下文与数据目录</h2>
            <p>
              <code>host</code> 是只读快照，不包含 API Key、Token 或保存全局配置的句柄。插件私有数据应写到 <code>plugin_root</code>。
            </p>
            <dl class="docs-field-grid">
              <div>
                <dt>host.ui_language</dt>
                <dd>当前 UI 语言，例如 <code>zh_CN</code>、<code>ja</code>。</dd>
              </div>
              <div>
                <dt>host.selected_llm_provider</dt>
                <dd>当前选择的 LLM provider 名称，仅用于只读判断。</dd>
              </div>
              <div>
                <dt>host.project_data_dir</dt>
                <dd>项目数据目录快照，默认指向 <code>data</code>。</dd>
              </div>
              <div>
                <dt>plugin_root</dt>
                <dd>插件私有数据目录，适合保存插件配置、缓存索引和运行状态。</dd>
              </div>
            </dl>
          </section>

          <section id="safety" class="docs-section">
            <p class="eyebrow">13 / SAFETY</p>
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
import { BookOpen, FileText, GitPullRequest, ImageIcon, Package, PackageCheck, ShieldCheck } from '@lucide/vue'
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
  { href: '#api-overview', label: '注册接口' },
  { href: '#llm-tools', label: 'LLM 工具' },
  { href: '#adapters', label: 'Adapter' },
  { href: '#frontend-config', label: '配置页' },
  { href: '#frontend-page', label: '前端页' },
  { href: '#context', label: '上下文' },
  { href: '#safety', label: '安全规范' }
]

const capabilityRows = [
  {
    method: 'register.register_llm_adapter(provider, AdapterClass)',
    title: 'LLM 后端',
    text: '注册新的聊天模型服务适配器，Adapter 继承 sdk.adapters.LLMAdapter。'
  },
  {
    method: 'register.register_tts_adapter(provider, AdapterClass)',
    title: 'TTS 后端',
    text: '注册语音合成后端，Adapter 继承 sdk.adapters.TTSAdapter。'
  },
  {
    method: 'register.register_asr_adapter(slug, AdapterClass)',
    title: 'ASR 后端',
    text: '注册语音识别后端，Adapter 继承 sdk.adapters.ASRAdapter。'
  },
  {
    method: 'register.register_t2i_adapter(provider, AdapterClass)',
    title: 'T2I 后端',
    text: '注册文生图后端，provider 建议小写。'
  },
  {
    method: 'register.register_frontend_config_page(contribution)',
    title: 'React 配置页',
    text: '用 schema 渲染插件配置表单，保存时回调到插件代码。'
  },
  {
    method: 'register.register_frontend_page(contribution)',
    title: 'iframe 前端页',
    text: '挂载插件自带的 dist/index.html，适合完整工具页面。'
  },
  {
    method: 'register.register_user_input_trigger(callback)',
    title: '用户输入触发器',
    text: '让插件把外部事件转成用户消息，例如识屏、传感器或监听器。'
  },
  {
    method: 'register.register_workflow(contribution)',
    title: '工作流',
    text: '注册插件自带 workflow YAML，可选绑定输出 contract。'
  }
]

const repoTree = `shinsekai-plugin-example/
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

const toolExample = `# example_plugin/llm_tool.py
from sdk.tool_registry import ToolNotReady, tool


@tool(
    name="example_lookup",
    description="查询插件内部数据并返回给 LLM。",
    group="example",
    risk="low",
)
def example_lookup(query: str, limit: int = 5) -> dict:
    if not query.strip():
        return {"error": "query is required"}
    if model_is_loading():
        raise ToolNotReady("示例插件模型仍在加载，请稍后重试。")
    return {"query": query, "items": search_items(query, limit)}


# example_plugin/plugin.py 的 initialize() 里导入一次：
def initialize(self, register, plugin_root, host) -> None:
    import plugins.example_plugin.llm_tool as _tool  # noqa: F401`

const adapterExample = `from sdk.adapters import TTSAdapter
from sdk.plugin import PluginBase


class ExampleTTSAdapter(TTSAdapter):
    @classmethod
    def get_config_schema(cls) -> dict[str, dict]:
        return {
            "api_key": {"type": "str", "label": "API Key", "secret": True},
            "base_url": {"type": "str", "label": "Base URL", "default": ""},
        }

    def generate_speech(self, text, file_path=None, **kwargs):
        # 返回生成后的音频路径；失败时返回 None。
        return synthesize_to_file(text, file_path)

    def switch_model(self, model_info):
        pass


class ExamplePlugin(PluginBase):
    def initialize(self, register, plugin_root, host) -> None:
        register.register_tts_adapter("example_tts", ExampleTTSAdapter)
        # register.register_asr_adapter("example_asr", ExampleASRAdapter)
        # register.register_llm_adapter("example_llm", ExampleLLMAdapter)
        # register.register_t2i_adapter("example_t2i", ExampleT2IAdapter)`

const frontendConfigExample = `from sdk.types import FrontendConfigAction, FrontendConfigContribution


def initialize(self, register, plugin_root, host) -> None:
    config_path = plugin_root / "config.json"

    register.register_frontend_config_page(
        FrontendConfigContribution(
            page_id="example_plugin",
            title="Example Plugin",
            kind="settings",
            description="配置示例插件。",
            restart_hint="修改后可能需要重新加载插件。",
            schema=[
                {
                    "id": "main",
                    "title": "基础设置",
                    "fields": [
                        {"key": "enabled", "label": "启用", "type": "boolean", "defaultValue": True},
                        {"key": "mode", "label": "模式", "type": "select", "options": [
                            {"label": "安全", "value": "safe"},
                            {"label": "快速", "value": "fast"},
                        ]},
                        {"key": "retries", "label": "重试次数", "type": "number", "min": 0, "max": 5},
                    ],
                }
            ],
            load_values=lambda: load_json(config_path),
            save_values=lambda values: save_json(config_path, values),
            actions=[
                FrontendConfigAction(
                    id="test",
                    label="测试连接",
                    variant="primary",
                    run=lambda values: {"ok": test_connection(values)},
                )
            ],
        )
    )`

const frontendPageExample = `from pathlib import Path
from sdk.types import FrontendPageContribution


def initialize(self, register, plugin_root, host) -> None:
    page_entry = Path(__file__).parent / "frontend" / "dist" / "index.html"
    register.register_frontend_page(
        FrontendPageContribution(
            page_id="example_dashboard",
            title="Example Dashboard",
            kind="tools",
            description="插件自带的完整前端工具页。",
            entry=str(page_entry),
        )
    )`
</script>
