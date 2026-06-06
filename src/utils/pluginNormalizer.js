export const DEFAULT_REGISTRY_URL = 'https://pub-9e11c3d88dbc49699652c547dcf7efe7.r2.dev/registry/plugin_cache_original.json'
export const RAW_REGISTRY_URL = 'https://raw.githubusercontent.com/End0rph1nww/Shinsekai-Plugin-Registry/main/plugin_cache_original.json'
export const DEFAULT_REGISTRY_FALLBACK_URLS = [RAW_REGISTRY_URL]
export const SUBMIT_TEMPLATE = 'PLUGIN_PUBLISH.yml'
export const SUBMIT_PLUGIN_INFO_FIELD = 'plugin-info'
export const SUBMIT_PLUGIN_URL = `https://github.com/End0rph1nww/Shinsekai-Plugin-Registry/issues/new?template=${SUBMIT_TEMPLATE}`
export const VERIFICATION_TEMPLATE = 'VERIFICATION_REQUEST.yml'
export const VERIFICATION_INFO_FIELD = 'verification-info'
export const VERIFICATION_REQUEST_URL = `https://github.com/End0rph1nww/Shinsekai-Plugin-Registry/issues/new?template=${VERIFICATION_TEMPLATE}`
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

function normalizeReview(value) {
  return value && typeof value === 'object' && !Array.isArray(value) ? value : {}
}

function normalizeTrustState(source) {
  const review = normalizeReview(source.review)
  const trustLevel = asString(source.trust_level || source.trustLevel || 'community').toLowerCase()
  const verified = source.verified === true && trustLevel === 'verified'
  if (verified) {
    return {
      label: 'Verified',
      review,
      state: 'verified',
      summary: '已由 Shinsekai Registry 维护者人工验证。',
      trustLevel: 'verified',
      verified: true
    }
  }
  if (trustLevel === 'verified_update_pending') {
    return {
      label: 'Pending Review',
      review,
      state: 'pending',
      summary: '曾经通过人工验证，但当前包体、commit 或版本等待复审。',
      trustLevel: 'verified_update_pending',
      verified: false
    }
  }
  if (trustLevel === 'blocked') {
    return {
      label: 'Blocked',
      review,
      state: 'blocked',
      summary: '该插件已被 Shinsekai Registry 审核拦截。',
      trustLevel: 'blocked',
      verified: false
    }
  }
  return {
    label: 'Community',
    review,
    state: 'community',
    summary: '社区插件：已通过基础 CI 分发检查，但尚未经过维护者人工验证。',
    trustLevel: 'community',
    verified: false
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
  const trust = normalizeTrustState(source)

  return {
    id: asString(source.id, name || `plugin-${index + 1}`),
    name,
    displayName,
    display_name: displayName,
    author: asString(source.author, 'Unknown'),
    socialLink: asString(source.social_link || source.socialLink),
    social_link: asString(source.social_link || source.socialLink),
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
    trustLevel: trust.trustLevel,
    trustState: trust.state,
    trustLabel: trust.label,
    trustSummary: trust.summary,
    verified: trust.verified,
    review: trust.review,
    repoUpdatedAt: '',
    repoUpdatedAtDate: null,
    installable: Boolean(source.entry || packageUrl || source.repo),
    raw: source
  }
}

export function buildVerificationRequestIssueUrl(plugin, baseUrl = VERIFICATION_REQUEST_URL) {
  const source = plugin && typeof plugin === 'object' ? plugin : {}
  const payload = Object.fromEntries(Object.entries({
    plugin_name: asString(source.name || source.displayName),
    repo: asString(source.repoUrl || normalizeRepo(source.repo)),
    version: asString(source.version),
    commit_sha: asString(source.commitSha || source.commit_sha),
    package_sha256: asString(source.packageSha256 || source.sha256),
    package_url: asString(source.packageUrl || source.downloadUrl || source.download_url),
    reason: 'Request maintainer verification for this Shinsekai community plugin.'
  }).filter(([, value]) => value))
  const body = `\`\`\`json\n${JSON.stringify(payload, null, 2)}\n\`\`\`\n`

  try {
    const url = new URL(baseUrl)
    if (!url.searchParams.get('template')) url.searchParams.set('template', VERIFICATION_TEMPLATE)
    if (payload.plugin_name) url.searchParams.set('title', `[Verification] ${payload.plugin_name}`)
    url.searchParams.delete('body')
    url.searchParams.set(VERIFICATION_INFO_FIELD, body)
    return url.toString()
  } catch (_) {
    return baseUrl
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
  const payload = {
    display_name: asString(form.display_name),
    desc: asString(form.desc),
    author: asString(form.author),
    repo: asString(form.repo),
    tags,
    social_link: asString(form.social_link)
  }
  const shinsekaiVersion = asString(form.shinsekai_version)
  if (shinsekaiVersion) payload.shinsekai_version = shinsekaiVersion
  return payload
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
