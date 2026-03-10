<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { searchCommands } from '../data/commands'
import { useLocale, useUI } from '../composables/useLocale'

const emit = defineEmits(['toggle-sidebar'])
const router = useRouter()
const { locale, toggleLocale, t } = useLocale()
const { ui } = useUI()
const query = ref('')
const showResults = ref(false)

const results = computed(() => searchCommands(query.value))

function selectCommand(cmd) {
  router.push({ name: 'command', params: { name: cmd.name } })
  query.value = ''
  showResults.value = false
}

watch(query, (val) => {
  showResults.value = val.length > 0
})

function onBlur() {
  setTimeout(() => { showResults.value = false }, 200)
}
</script>

<template>
  <header class="app-header">
    <div class="header-left">
      <button class="menu-btn" @click="emit('toggle-sidebar')" aria-label="Menu">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 12h18M3 6h18M3 18h18"/>
        </svg>
      </button>
      <router-link to="/" class="logo">
        <span class="logo-icon">🦞</span>
        <span class="logo-text">OpenClaw</span>
        <span class="logo-suffix">Command Reference</span>
      </router-link>
    </div>

    <div class="header-right">
      <div class="search-wrapper">
        <div class="search-box">
          <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
          </svg>
          <input
            v-model="query"
            type="text"
            :placeholder="ui('searchPlaceholder')"
            class="search-input"
            @focus="showResults = query.length > 0"
            @blur="onBlur"
          />
        </div>

        <div class="search-results" v-if="showResults && results.length > 0">
          <div
            v-for="cmd in results.slice(0, 8)"
            :key="cmd.name"
            class="search-result-item"
            @mousedown.prevent="selectCommand(cmd)"
          >
            <span class="result-name">{{ cmd.nameEn ? t(cmd, 'name') : cmd.name }}</span>
            <span class="result-category">{{ t(cmd, 'categoryName') }}</span>
            <span class="result-desc">{{ t(cmd, 'description') }}</span>
          </div>
        </div>
        <div class="search-results search-empty" v-if="showResults && query && results.length === 0">
          <div class="search-result-item">{{ ui('searchNoResult') }}</div>
        </div>
      </div>

      <button class="lang-btn" @click="toggleLocale" :title="locale === 'zh' ? 'Switch to English' : '切换到中文'">
        {{ locale === 'zh' ? 'EN' : '中' }}
      </button>

      <a href="https://github.com/openclaw/openclaw" target="_blank" class="github-link" aria-label="GitHub">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
      </a>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--header-height);
  background: var(--color-bg-secondary);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  gap: 16px;
  z-index: 100;
  backdrop-filter: blur(12px);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.menu-btn {
  display: none;
  background: none;
  border: none;
  color: var(--color-text);
  cursor: pointer;
  padding: 4px;
}

@media (max-width: 768px) {
  .menu-btn { display: flex; }
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--color-text);
  font-weight: 600;
  font-size: 15px;
  white-space: nowrap;
}

.logo-icon {
  font-size: 22px;
}

.logo-text {
  color: var(--color-accent);
}

.logo-suffix {
  color: var(--color-text-secondary);
  font-weight: 400;
  font-size: 13px;
}

@media (max-width: 640px) {
  .logo-suffix { display: none; }
}

.search-wrapper {
  position: relative;
  width: 280px;
}

@media (max-width: 640px) {
  .search-wrapper { width: 160px; }
}

.search-box {
  display: flex;
  align-items: center;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: 0 10px;
  transition: border-color 0.2s;
}

.search-box:focus-within {
  border-color: var(--color-accent-dim);
}

.search-icon {
  color: var(--color-text-muted);
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  background: none;
  border: none;
  color: var(--color-text);
  font-size: 13px;
  padding: 7px 8px;
  outline: none;
  font-family: inherit;
  min-width: 0;
}

.search-input::placeholder {
  color: var(--color-text-muted);
}

.search-results {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  width: 400px;
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0,0,0,0.4);
}

@media (max-width: 640px) {
  .search-results {
    width: calc(100vw - 32px);
    right: auto;
    left: auto;
    right: -60px;
  }
}

.search-result-item {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  cursor: pointer;
  transition: background 0.15s;
}

.search-result-item:hover {
  background: var(--color-bg-hover);
}

.result-name {
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  color: var(--color-accent-bright);
  font-weight: 600;
}

.result-category {
  font-size: 11px;
  color: var(--color-text-muted);
  background: var(--color-bg);
  padding: 1px 6px;
  border-radius: 3px;
}

.result-desc {
  font-size: 12px;
  color: var(--color-text-secondary);
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.search-empty .search-result-item {
  color: var(--color-text-muted);
  cursor: default;
  font-size: 13px;
}

.lang-btn {
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
  font-size: 12px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: var(--radius);
  cursor: pointer;
  font-family: inherit;
  transition: all 0.2s;
  white-space: nowrap;
}

.lang-btn:hover {
  border-color: var(--color-accent-dim);
  color: var(--color-accent-bright);
}

.github-link {
  color: var(--color-text-secondary);
  flex-shrink: 0;
  display: flex;
  transition: color 0.2s;
}

.github-link:hover {
  color: var(--color-text);
}
</style>
