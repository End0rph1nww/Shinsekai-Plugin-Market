export const DEFAULT_REGISTRY_URL = 'https://raw.githubusercontent.com/End0rph1nww/Shinsekai-Plugin-Registry/main/plugins.json'
export const UPSTREAM_REGISTRY_URL = 'https://raw.githubusercontent.com/RachelForster/Shinsekai-Plugin-Registry/main/plugins.json'
export const SUBMIT_PLUGIN_URL = 'https://github.com/RachelForster/Shinsekai-Plugin-Registry/issues/new'
export const TEST_REGISTRY_REPO_URL = 'https://github.com/End0rph1nww/Shinsekai-Plugin-Registry'

function asString(value, fallback = '') {
  if (value === null || value === undefined) return fallback
  return String(value).trim()
}

function normalizeRepo(repo) {
  const value = asString(repo)
  if (!value) return ''
  if (value.startsWith('http://') || value.startsWith('https://')) return value
  return `https://github.com/${value.replace(/^github\.com\//, '')}`
}

function normalizeTags(tags, plugin) {
  if (Array.isArray(tags)) return tags.map(tag => asString(tag)).filter(Boolean)
  if (typeof tags === 'string') return tags.split(/[，,]/).map(tag => tag.trim()).filter(Boolean)

  const fallback = []
  if (plugin?.entry) fallback.push('可安装')
  if (plugin?.repo) fallback.push('已收录')
  return fallback
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
  const updatedAtDate = parseDate(source.updated_at)
  const tags = normalizeTags(source.tags, source)

  return {
    id: asString(source.id, name || `plugin-${index + 1}`),
    name,
    displayName,
    display_name: displayName,
    author: asString(source.author, 'Unknown'),
    repo,
    repoUrl,
    description: asString(source.description || source.desc, '这个插件还没有提供描述。'),
    desc: asString(source.description || source.desc, '这个插件还没有提供描述。'),
    entry: asString(source.entry),
    version: asString(source.version, '未标注'),
    shinsekaiVersion: asString(source.shinsekai_version),
    downloadUrl: asString(source.download_url),
    sha256: asString(source.sha256),
    commitSha: asString(source.commit_sha),
    size: source.size ?? null,
    updatedAt: asString(source.updated_at),
    updatedAtDate,
    tags,
    logo: asString(source.logo),
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
