export const DEFAULT_REGISTRY_URL = 'https://raw.githubusercontent.com/RachelForster/Shinsekai-Plugin-Registry/main/plugins.json'
export const SUBMIT_PLUGIN_URL = 'https://github.com/RachelForster/Shinsekai-Plugin-Registry/issues/new'

function asString(value, fallback = '') {
  if (value === null || value === undefined) return fallback
  return String(value).trim()
}

function asNumber(value, fallback = 0) {
  const number = Number(value)
  return Number.isFinite(number) ? number : fallback
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

export function normalizePlugin(raw, index = 0) {
  const source = raw && typeof raw === 'object' ? raw : {}
  const name = asString(source.name, `plugin-${index + 1}`)
  const displayName = asString(source.display_name, name)
  const repo = asString(source.repo)
  const repoUrl = normalizeRepo(repo)
  const repoPath = normalizeRepoPath(repo)
  const updatedAtDate = parseDate(source.updated_at)
  const tags = normalizeTags(source.tags)
  const description = asString(source.description || source.desc, '这个插件还没有提供描述。')
  const version = asString(source.version, '未标注')

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
    entry: asString(source.entry),
    version,
    shinsekaiVersion: asString(source.shinsekai_version),
    downloadUrl: asString(source.download_url),
    sha256: asString(source.sha256),
    commitSha: asString(source.commit_sha),
    size: source.size ?? null,
    updatedAt: asString(source.updated_at),
    updatedAtDate,
    tags,
    logo: asString(source.logo),
    stars: asNumber(source.stars ?? source.stargazers_count),
    forks: asNumber(source.forks ?? source.forks_count),
    repoUpdatedAt: '',
    repoUpdatedAtDate: null,
    installable: Boolean(source.entry || source.download_url || source.repo),
    raw: source
  }
}

export function normalizeRegistryPayload(payload) {
  if (Array.isArray(payload)) {
    return payload.map((item, index) => normalizePlugin(item, index))
  }

  if (payload && typeof payload === 'object') {
    return Object.entries(payload).map(([key, value], index) => {
      const item = value && typeof value === 'object' ? { name: key, ...value } : { name: key }
      return normalizePlugin(item, index)
    })
  }

  throw new Error('Registry JSON must be an array or object')
}

export function buildInstallInfo(plugin) {
  const lines = [
    `name: ${plugin.displayName || plugin.name}`,
    plugin.name ? `registry_name: ${plugin.name}` : '',
    plugin.author ? `author: ${plugin.author}` : '',
    plugin.repo ? `repo: ${plugin.repo}` : '',
    plugin.entry ? `entry: ${plugin.entry}` : '',
    plugin.version && plugin.version !== '未标注' ? `version: ${plugin.version}` : '',
    plugin.downloadUrl ? `download_url: ${plugin.downloadUrl}` : '',
    plugin.sha256 ? `sha256: ${plugin.sha256}` : ''
  ].filter(Boolean)

  return lines.join('\n')
}
