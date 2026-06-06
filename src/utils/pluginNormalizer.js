export const DEFAULT_REGISTRY_URL = 'https://raw.githubusercontent.com/RachelForster/Shinsekai-Plugin-Registry/main/plugin_cache_original.json'
export const SUBMIT_TEMPLATE = 'PLUGIN_PUBLISH.yml'
export const SUBMIT_PLUGIN_INFO_FIELD = 'plugin-info'
export const SUBMIT_PLUGIN_URL = `https://github.com/RachelForster/Shinsekai-Plugin-Registry/issues/new?template=${SUBMIT_TEMPLATE}`
export const MAX_SUBMISSION_DESC_LENGTH = 200
const GITHUB_SLUG_PART_RE = /^[A-Za-z0-9_.-]+$/

function asString(value, fallback = '') {
  if (value === null || value === undefined) return fallback
  return String(value).trim()
}

function asNumber(value, fallback = 0) {
  const number = Number(value)
  return Number.isFinite(number) ? number : fallback
}

function asOptionalNumber(value) {
  const number = Number(value)
  return Number.isFinite(number) ? number : null
}

function normalizeRepo(repo) {
  const value = asString(repo)
  if (!value) return ''
  if (value.startsWith('http://') || value.startsWith('https://')) return value
  return `https://github.com/${value.replace(/^github\.com\//, '')}`
}

function normalizeRepoPath(repo) {
  const value = asString(repo)
  if (!value) return ''

  try {
    if (value.startsWith('http://') || value.startsWith('https://')) {
      const url = new URL(value)
      return url.hostname === 'github.com' ? url.pathname.replace(/^\//, '').replace(/\.git$/, '') : ''
    }
  } catch (_) {
    return ''
  }

  return value.replace(/^github\.com\//, '').replace(/^\//, '').replace(/\.git$/, '')
}

export function isValidGithubRepoUrl(value) {
  try {
    const url = new URL(asString(value))
    const parts = url.pathname.replace(/^\/|\/$/g, '').split('/')
    return url.protocol === 'https:'
      && url.hostname === 'github.com'
      && parts.length === 2
      && parts.every(part => GITHUB_SLUG_PART_RE.test(part))
      && !parts[1].endsWith('.git')
      && !url.search
      && !url.hash
  } catch (_) {
    return false
  }
}

function normalizeTags(tags) {
  if (Array.isArray(tags)) return tags.map(tag => asString(tag)).filter(Boolean)
  if (typeof tags === 'string') return tags.split(/[,，、\s]+/).map(tag => tag.trim()).filter(Boolean)
  return []
}

function parseDate(value) {
  const raw = asString(value)
  if (!raw) return null
  const date = new Date(raw)
  return Number.isNaN(date.getTime()) ? null : date
}

function normalizeScanLabel(value, fallback = 'unknown') {
  const label = asString(value).toLowerCase()
  if (!label) return fallback
  if (['pass', 'passed', 'success', 'ok', 'true'].includes(label)) return 'passed'
  if (['block', 'blocked', 'fail', 'failed', 'error', 'false'].includes(label)) return 'blocked'
  return fallback
}

function normalizeScanState(secScan) {
  const staticScan = secScan?.static ?? secScan?.state ?? secScan?.status ?? null
  if (staticScan === null || staticScan === undefined) return { state: 'unknown', message: '' }
  if (typeof staticScan !== 'object') {
    return {
      state: typeof staticScan === 'boolean' ? (staticScan ? 'passed' : 'blocked') : normalizeScanLabel(staticScan),
      message: asString(secScan?.msg || secScan?.message)
    }
  }

  return {
    state: typeof staticScan.pass === 'boolean'
      ? (staticScan.pass ? 'passed' : 'blocked')
      : normalizeScanLabel(staticScan.state || staticScan.status || staticScan.result),
    message: asString(staticScan.msg || staticScan.message)
  }
}

function registryEntries(payload) {
  if (Array.isArray(payload)) return payload.map((item, index) => [String(index), item])
  if (!payload || typeof payload !== 'object') throw new Error('Registry JSON must be an array or object')

  if (payload.plugins && typeof payload.plugins === 'object' && !Array.isArray(payload.plugins)) {
    return Object.entries(payload.plugins)
  }

  return Object.entries(payload).filter(([, value]) => value && typeof value === 'object')
}

export function normalizePlugin(raw, index = 0) {
  const source = raw && typeof raw === 'object' ? raw : {}
  const packageInfo = source.package && typeof source.package === 'object' ? source.package : {}
  const name = asString(source.name, `plugin-${index + 1}`)
  const displayName = asString(source.display_name, name)
  const repo = asString(source.repo)
  const repoUrl = normalizeRepo(repo)
  const repoPath = normalizeRepoPath(repo)
  const updatedAtDate = parseDate(source.updated_at)
  const tags = normalizeTags(source.tags)
  const description = asString(source.description || source.desc, '这个插件还没有提供描述。')
  const shortDescription = asString(source.short_description || source.short_desc || source.desc, description)
  const version = asString(source.version, '未标注')
  const downloadUrl = asString(source.download_url || packageInfo.url)
  const sha256 = asString(source.sha256 || packageInfo.sha256)
  const size = asOptionalNumber(source.size ?? packageInfo.size)
  const packageUrl = asString(packageInfo.url || downloadUrl)
  const packageSha256 = asString(packageInfo.sha256 || sha256)
  const packageSize = asOptionalNumber(packageInfo.size ?? size)
  const packageSource = asString(packageInfo.source || (packageUrl ? 'package' : ''))
  const scan = normalizeScanState(source.sec_scan)

  return {
    id: asString(source.id, name || `plugin-${index + 1}`),
    name,
    displayName,
    display_name: displayName,
    author: asString(source.author, 'Unknown'),
    repo,
    repoUrl,
    repoPath,
    description,
    desc: description,
    shortDescription,
    short_description: shortDescription,
    entry: asString(source.entry),
    version,
    shinsekaiVersion: asString(source.shinsekai_version),
    downloadUrl,
    sha256,
    commitSha: asString(source.commit_sha),
    size,
    updatedAt: asString(source.updated_at),
    updatedAtDate,
    tags,
    logo: asString(source.logo),
    stars: asNumber(source.stars ?? source.stargazers_count),
    forks: asNumber(source.forks ?? source.forks_count),
    packageSource,
    packageUrl,
    packageSha256,
    packageSize,
    packageR2Key: asString(packageInfo.r2_key || packageInfo.r2Key),
    packageHasOfficialUrl: Boolean(packageUrl),
    secScan: source.sec_scan && typeof source.sec_scan === 'object' ? source.sec_scan : null,
    scanState: scan.state,
    scanMessage: scan.message,
    repoUpdatedAt: '',
    repoUpdatedAtDate: null,
    installable: Boolean(source.entry || packageUrl || source.repo),
    raw: source
  }
}

export function normalizeRegistryPayload(payload) {
  return registryEntries(payload).map(([key, value], index) => {
    const item = value && typeof value === 'object' ? { name: key, ...value } : { name: key }
    return normalizePlugin(item, index)
  })
}

export function buildInstallInfo(plugin) {
  const lines = [
    `name: ${plugin.displayName || plugin.name}`,
    plugin.name ? `registry_name: ${plugin.name}` : '',
    plugin.author ? `author: ${plugin.author}` : '',
    plugin.repo ? `repo: ${plugin.repo}` : '',
    plugin.entry ? `entry: ${plugin.entry}` : '',
    plugin.version && plugin.version !== '未标注' ? `version: ${plugin.version}` : '',
    plugin.packageUrl ? `package_url: ${plugin.packageUrl}` : '',
    plugin.downloadUrl && plugin.downloadUrl !== plugin.packageUrl ? `download_url: ${plugin.downloadUrl}` : '',
    plugin.packageSha256 ? `sha256: ${plugin.packageSha256}` : '',
    plugin.packageR2Key ? `r2_key: ${plugin.packageR2Key}` : ''
  ].filter(Boolean)

  return lines.join('\n')
}

export function compactHash(value, length = 12) {
  const hash = asString(value)
  if (!hash) return '未提供'
  return hash.length <= length ? hash : `${hash.slice(0, length)}…`
}

export function formatBytes(value) {
  const size = Number(value)
  if (!Number.isFinite(size) || size <= 0) return '未标注'
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
  return `${(size / 1024 / 1024).toFixed(1)} MB`
}

export function normalizeSubmissionForm(form) {
  const tags = normalizeTags(form.tags).slice(0, 5)
  return {
    display_name: asString(form.display_name),
    desc: asString(form.desc),
    author: asString(form.author),
    repo: asString(form.repo),
    entry: asString(form.entry),
    tags,
    social_link: asString(form.social_link)
  }
}

export function buildSubmissionJson(form) {
  return JSON.stringify(normalizeSubmissionForm(form), null, 2)
}

export function buildSubmissionIssueUrl(form, baseUrl = SUBMIT_PLUGIN_URL) {
  const payload = normalizeSubmissionForm(form)
  const body = `\`\`\`json\n${JSON.stringify(payload, null, 2)}\n\`\`\`\n`

  try {
    const url = new URL(baseUrl)
    if (!url.searchParams.get('template')) url.searchParams.set('template', SUBMIT_TEMPLATE)
    if (payload.display_name) url.searchParams.set('title', `[Plugin] ${payload.display_name}`)
    url.searchParams.delete('body')
    url.searchParams.set(SUBMIT_PLUGIN_INFO_FIELD, body)
    return url.toString()
  } catch (_) {
    return baseUrl
  }
}
