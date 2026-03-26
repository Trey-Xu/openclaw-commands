<script setup>
import { ref, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { categories, getCommandByName } from '../data/commands'
import { useLocale, useUI } from '../composables/useLocale'

defineProps({
  open: Boolean
})
const emit = defineEmits(['close'])
const route = useRoute()
const { t } = useLocale()
const { ui } = useUI()
const expanded = ref({})

function toggle(id) {
  expanded.value[id] = !expanded.value[id]
}

function isExpanded(id) {
  return expanded.value[id] !== false
}

function isActive(cmdName) {
  return route.params.name === cmdName
}

function isReleasesActive() {
  return route.name === 'releases'
}

function onNavClick() {
  if (window.innerWidth <= 768) emit('close')
}

watch(() => route.params.name, async (name) => {
  if (!name) return
  const cmd = getCommandByName(name)
  if (cmd) {
    expanded.value[cmd.categoryId] = true
    await nextTick()
    const el = document.querySelector('.nav-item.active')
    if (el) el.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }
}, { immediate: true })
</script>

<template>
  <div class="sidebar-overlay" :class="{ active: open }" @click="emit('close')"></div>
  <aside class="sidebar" :class="{ open }">
    <nav class="sidebar-nav">
      <div class="nav-top">
        <router-link
          :to="{ name: 'releases' }"
          class="nav-item nav-item-top"
          :class="{ active: isReleasesActive() }"
          @click="onNavClick"
        >
          <span class="nav-item-name">{{ ui('releaseNotes') }}</span>
        </router-link>
      </div>
      <div v-for="cat in categories" :key="cat.id" class="nav-group">
        <div class="nav-group-header" @click="toggle(cat.id)">
          <span class="nav-group-icon">{{ cat.icon }}</span>
          <span class="nav-group-title">{{ t(cat, 'name') }}</span>
          <svg class="nav-chevron" :class="{ expanded: isExpanded(cat.id) }" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </div>
        <div class="nav-group-items" v-show="isExpanded(cat.id)">
          <router-link
            v-for="cmd in cat.commands"
            :key="cmd.name"
            :to="{ name: 'command', params: { name: cmd.name } }"
            class="nav-item"
            :class="{ active: isActive(cmd.name) }"
            @click="onNavClick"
          >
            <span class="nav-item-name">{{ cmd.nameEn ? t(cmd, 'name') : cmd.name }}</span>
          </router-link>
        </div>
      </div>
    </nav>

    <div class="sidebar-footer">
      <a href="https://docs.openclaw.ai/cli" target="_blank" class="sidebar-footer-link">
        {{ ui('officialDocs') }} ↗
      </a>
    </div>
  </aside>
</template>

<style scoped>
.sidebar-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  z-index: 49;
}

@media (max-width: 768px) {
  .sidebar-overlay.active { display: block; }
}

.sidebar {
  position: fixed;
  top: var(--header-height);
  left: 0;
  bottom: 0;
  width: var(--sidebar-width);
  background: var(--color-bg-secondary);
  border-right: 1px solid var(--color-border);
  overflow-y: auto;
  z-index: 50;
  display: flex;
  flex-direction: column;
  transition: transform 0.25s ease;
}

@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
  }
  .sidebar.open {
    transform: translateX(0);
  }
}

.sidebar-nav {
  flex: 1;
  padding: 12px 0;
}

.nav-top {
  padding: 0 0 8px;
  border-bottom: 1px solid var(--color-border);
  margin-bottom: 8px;
}

.nav-item-top {
  padding-left: 16px;
  font-family: inherit;
  color: var(--color-text-secondary);
}

.nav-group {
  margin-bottom: 4px;
}

.nav-group-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-secondary);
  transition: color 0.15s;
  user-select: none;
}

.nav-group-header:hover {
  color: var(--color-text);
}

.nav-group-icon { font-size: 15px; }

.nav-group-title {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.nav-chevron {
  flex-shrink: 0;
  transition: transform 0.2s;
}

.nav-chevron.expanded {
  transform: rotate(90deg);
}

.nav-group-items {
  padding: 2px 0;
}

.nav-item {
  display: block;
  padding: 6px 16px 6px 40px;
  font-size: 13px;
  color: var(--color-text-muted);
  font-family: 'JetBrains Mono', monospace;
  transition: all 0.15s;
  border-left: 2px solid transparent;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.nav-item:hover {
  color: var(--color-text);
  background: var(--color-bg-hover);
}

.nav-item.active {
  color: var(--color-accent-bright);
  background: var(--color-bg-hover);
  border-left-color: var(--color-accent);
}

.sidebar-footer {
  padding: 12px 16px;
  border-top: 1px solid var(--color-border);
}

.sidebar-footer-link {
  font-size: 12px;
  color: var(--color-text-muted);
}

.sidebar-footer-link:hover {
  color: var(--color-accent-bright);
}
</style>
