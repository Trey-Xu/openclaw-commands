<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { OPENCLAW_VERSION, OPENCLAW_RELEASE_URL } from '../config/version'
import { fetchReleaseNotes, renderInlineMarkdown, pickBilingualText } from '../data/releases'
import { useLocale, useUI } from '../composables/useLocale'

const route = useRoute()
const router = useRouter()
const { locale } = useLocale()
const { ui } = useUI()

const loading = ref(true)
const error = ref('')
const releases = ref([])

const selectedTag = computed(() => {
  const tag = route.params.tag
  if (typeof tag === 'string' && tag.trim()) return tag.trim()
  return `v${OPENCLAW_VERSION}`
})

const selected = computed(() => releases.value.find(r => r.tagName === selectedTag.value) || null)

const nonEmptySections = computed(() => (selected.value?.sections || []).filter(s => s?.items?.length))

const versions = computed(() =>
  releases.value.map(r => ({
    tagName: r.tagName,
    version: r.version,
    publishedAt: r.publishedAt,
    url: r.url
  }))
)

async function load(force = false) {
  loading.value = true
  error.value = ''
  try {
    releases.value = await fetchReleaseNotes({ force })
  } catch (e) {
    error.value = String(e?.message || e)
  } finally {
    loading.value = false
  }
}

function onSelect(e) {
  const tag = e.target.value
  router.push({ name: 'releases', params: { tag } })
}

function renderItem(item) {
  return renderInlineMarkdown(pickBilingualText(item, locale.value))
}

function renderSectionTitle(title) {
  const key = String(title || '')
  if (locale.value === 'zh') {
    if (key === 'Breaking') return '破坏性变更'
    if (key === 'Changes') return '变更'
    if (key === 'Fixes') return '修复'
  }
  return key
}

watch(selectedTag, () => {
  // If the URL points to a tag not in list, keep showing fallback latest.
  if (!loading.value && releases.value.length && !selected.value) {
    router.replace({ name: 'releases', params: { tag: releases.value[0]?.tagName || `v${OPENCLAW_VERSION}` } })
  }
})

onMounted(() => { load(false) })
</script>

<template>
  <div class="release-view">
    <nav class="breadcrumb">
      <router-link to="/">{{ ui('home') }}</router-link>
      <span class="sep">/</span>
      <span class="current">{{ ui('releaseNotes') }}</span>
    </nav>

    <div class="release-header">
      <div class="release-title-row">
        <h1 class="release-title">{{ ui('releaseNotes') }}</h1>
        <a :href="OPENCLAW_RELEASE_URL" target="_blank" class="release-latest">
          {{ ui('latest') }} v{{ OPENCLAW_VERSION }}
        </a>
      </div>
      <p class="release-desc">{{ locale === 'zh' ? '按版本查看 OpenClaw 的更新内容（来源：GitHub Releases）。' : 'View OpenClaw release notes by version (source: GitHub Releases).' }}</p>
    </div>

    <div class="release-toolbar">
      <label class="release-select-label">
        <span>{{ ui('version') }}</span>
        <select class="release-select" :value="selectedTag" @change="onSelect" :disabled="loading || !versions.length">
          <option v-for="v in versions" :key="v.tagName" :value="v.tagName">
            {{ v.tagName }}<span v-if="v.publishedAt"> · {{ String(v.publishedAt).slice(0, 10) }}</span>
          </option>
        </select>
      </label>

      <button class="refresh-btn" @click="load(true)" :disabled="loading">
        {{ ui('refresh') }}
      </button>
    </div>

    <div v-if="loading" class="release-card">
      <div class="muted">{{ ui('loading') }}</div>
    </div>

    <div v-else-if="error" class="release-card">
      <div class="muted">{{ ui('loadFailed') }}</div>
      <div class="error">{{ error }}</div>
    </div>

    <div v-else-if="selected" class="release-card">
      <div class="release-meta">
        <a :href="selected.url" target="_blank" class="release-tag">{{ selected.tagName }}</a>
        <span class="dot">·</span>
        <span class="muted">{{ String(selected.publishedAt || '').slice(0, 10) }}</span>
      </div>

      <div class="release-sections">
        <section v-for="sec in nonEmptySections" :key="sec.title" class="release-section">
          <h2 class="section-heading">{{ renderSectionTitle(sec.title) }}</h2>
          <ul class="release-list">
            <li v-for="(it, idx) in sec.items" :key="idx" v-html="renderItem(it)"></li>
          </ul>
        </section>

        <div v-if="nonEmptySections.length === 0" class="muted">
          {{ locale === 'zh' ? '该版本未提供结构化更新条目（可点击上方版本链接查看原文）。' : 'No structured bullets found; open the release link above for full notes.' }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.release-header {
  margin-bottom: 18px;
}

.release-title-row {
  display: flex;
  align-items: baseline;
  gap: 12px;
  flex-wrap: wrap;
}

.release-title {
  font-size: 26px;
  font-weight: 700;
}

.release-latest {
  font-size: 12px;
  color: var(--color-success);
  background: rgba(47, 191, 113, 0.1);
  padding: 4px 10px;
  border-radius: 999px;
  font-family: 'JetBrains Mono', monospace;
}

.release-desc {
  margin-top: 6px;
  color: var(--color-text-secondary);
  font-size: 14px;
}

.release-toolbar {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.release-select-label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 12px;
  color: var(--color-text-secondary);
}

.release-select {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  color: var(--color-text);
  padding: 8px 10px;
  border-radius: var(--radius);
  min-width: 260px;
}

.refresh-btn {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  color: var(--color-text);
  padding: 8px 12px;
  border-radius: var(--radius);
  cursor: pointer;
}

.refresh-btn:hover {
  border-color: var(--color-accent-dim);
  background: var(--color-bg-hover);
}

.release-card {
  padding: 18px;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
}

.release-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 14px;
}

.release-tag {
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  color: var(--color-accent-bright);
}

.dot {
  color: var(--color-border);
}

.muted {
  color: var(--color-text-muted);
  font-size: 13px;
}

.error {
  margin-top: 8px;
  color: var(--color-error);
  font-size: 12px;
  white-space: pre-wrap;
}

.release-section + .release-section {
  margin-top: 18px;
}

.release-list {
  margin-top: 8px;
  padding-left: 18px;
}

.release-list li {
  margin: 6px 0;
  color: var(--color-text-secondary);
  font-size: 14px;
  line-height: 1.6;
}

.release-list :deep(code) {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  background: var(--color-code-bg);
  padding: 2px 6px;
  border-radius: 6px;
}
</style>

