import { ref, computed } from 'vue'

const locale = ref(localStorage.getItem('openclaw-locale') || 'zh')

export function useLocale() {
  function setLocale(lang) {
    locale.value = lang
    localStorage.setItem('openclaw-locale', lang)
  }

  function toggleLocale() {
    setLocale(locale.value === 'zh' ? 'en' : 'zh')
  }

  function t(obj, field) {
    if (!obj) return ''
    if (locale.value === 'en') {
      return obj[field + 'En'] || obj[field] || ''
    }
    return obj[field] || ''
  }

  const isEn = computed(() => locale.value === 'en')
  const isZh = computed(() => locale.value === 'zh')

  return { locale, setLocale, toggleLocale, t, isEn, isZh }
}

const UI_STRINGS = {
  zh: {
    searchPlaceholder: '搜索命令...',
    searchNoResult: '未找到匹配的命令',
    home: '首页',
    officialDocs: '官方文档',
    globalFlags: '全局选项',
    commandCategories: '命令分类',
    syntax: '语法',
    subcommands: '子命令',
    options: '选项',
    examples: '使用示例',
    optionCol: '选项',
    descCol: '说明',
    notFoundTitle: '命令未找到',
    notFoundCmd: '找不到命令',
    backHome: '返回首页',
    categoryNotFound: '分类未找到',
    nSubcommands: '个子命令',
    heroTitle: 'OpenClaw Command Reference',
    heroBadge: 'CLI Reference',
    heroCategories: '大类别',
    heroCommands: '个命令',
    heroSubcommands: '个子命令',
    heroSuffix: '的完整参考手册',
    relatedCommands: '同类命令',
    pageNotFound: '页面走丢了，找不到该路径',
    copied: '已复制 ✓',
    copy: '复制',
    copyLink: '复制链接',
    linkCopied: '链接已复制 ✓',
  },
  en: {
    searchPlaceholder: 'Search commands...',
    searchNoResult: 'No matching commands found',
    home: 'Home',
    officialDocs: 'Official Docs',
    globalFlags: 'Global Flags',
    commandCategories: 'Categories',
    syntax: 'Syntax',
    subcommands: 'Subcommands',
    options: 'Options',
    examples: 'Examples',
    optionCol: 'Option',
    descCol: 'Description',
    notFoundTitle: 'Command Not Found',
    notFoundCmd: 'Cannot find command',
    backHome: 'Back to Home',
    categoryNotFound: 'Category Not Found',
    nSubcommands: 'subcommands',
    heroTitle: 'OpenClaw Command Reference',
    heroBadge: 'CLI Reference',
    heroCategories: 'categories',
    heroCommands: 'commands',
    heroSubcommands: 'subcommands',
    heroSuffix: '— Complete reference manual',
    relatedCommands: 'Related Commands',
    pageNotFound: 'Page not found — the path you requested does not exist.',
    copied: 'Copied ✓',
    copy: 'Copy',
    copyLink: 'Copy link',
    linkCopied: 'Link copied ✓',
  }
}

export function useUI() {
  function ui(key) {
    return UI_STRINGS[locale.value]?.[key] || UI_STRINGS.zh[key] || key
  }
  return { ui }
}
