import defaultConfig from '~/assets/config.json'

export interface LinkConfig {
  id: string
  title: string
  href: string
  icon?: string
}

export interface CategoryConfig {
  id: string
  title: string
  links: LinkConfig[]
}

export interface Settings {
  searchEngine: 'kagi' | 'duckduckgo' | 'google' | 'custom'
  customSearchUrl: string
  showSearchbar: boolean
  clockFormat: string
  accent: string
}

const STORAGE_KEY = 'nutab:v1'

export const SEARCH_ENGINES: Record<string, string> = {
  kagi: 'https://kagi.com/search?q={q}',
  duckduckgo: 'https://duckduckgo.com/?q={q}',
  google: 'https://www.google.com/search?q={q}',
}

const defaultSettings: Settings = {
  searchEngine: 'kagi',
  customSearchUrl: '',
  showSearchbar: true,
  clockFormat: 'HH:mm',
  accent: '#22d3ee',
}

export function uid(): string {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2, 10)
}

function seedCategories(): CategoryConfig[] {
  return (defaultConfig.categories as any[]).map((c) => ({
    id: uid(),
    title: c.title,
    links: (c.links || []).map((l: any) => ({ id: uid(), ...l })),
  }))
}

const categories = ref<CategoryConfig[]>([])
const settings = ref<Settings>({ ...defaultSettings })
const editMode = ref(false)
const loaded = ref(false)

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const data = JSON.parse(raw)
      if (Array.isArray(data.categories)) categories.value = data.categories
      settings.value = { ...defaultSettings, ...(data.settings || {}) }
    } else {
      // migrate the legacy searchbar toggle from before the store existed
      const legacy = localStorage.getItem('showSearchbar')
      if (legacy !== null) settings.value.showSearchbar = JSON.parse(legacy) ?? true
      categories.value = seedCategories()
    }
  } catch {
    categories.value = seedCategories()
  }
  loaded.value = true
}

watch(
  [categories, settings],
  () => {
    if (!loaded.value) return
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ version: 1, categories: categories.value, settings: settings.value }),
    )
  },
  { deep: true },
)

function addCategory() {
  categories.value.push({ id: uid(), title: 'New category', links: [] })
}

function serialize() {
  return JSON.stringify({ version: 1, categories: categories.value, settings: settings.value }, null, 2)
}

function exportConfig() {
  const blob = new Blob([serialize()], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'nutab-config.json'
  a.click()
  URL.revokeObjectURL(url)
}

function importConfig(file: File): Promise<void> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result))
        if (!Array.isArray(data.categories)) throw new Error('Missing categories')
        categories.value = data.categories.map((c: any) => ({
          id: c.id || uid(),
          title: String(c.title ?? 'Category'),
          links: (c.links || []).map((l: any) => ({
            id: l.id || uid(),
            title: String(l.title ?? ''),
            href: String(l.href ?? ''),
            ...(l.icon ? { icon: String(l.icon) } : {}),
          })),
        }))
        settings.value = { ...defaultSettings, ...(data.settings || {}) }
        resolve()
      } catch (e) {
        reject(e)
      }
    }
    reader.onerror = () => reject(reader.error)
    reader.readAsText(file)
  })
}

function resetConfig() {
  categories.value = seedCategories()
  settings.value = { ...defaultSettings }
}

export function useStore() {
  return {
    categories,
    settings,
    editMode,
    loaded,
    load,
    addCategory,
    exportConfig,
    importConfig,
    resetConfig,
  }
}
