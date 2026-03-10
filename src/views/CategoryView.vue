<script setup>
import { computed } from 'vue'
import { getCategoryById } from '../data/commands'
import { useLocale, useUI } from '../composables/useLocale'

const props = defineProps({ id: String })
const { t } = useLocale()
const { ui } = useUI()

const category = computed(() => getCategoryById(props.id))
</script>

<template>
  <div class="category-view" v-if="category">
    <div class="category-header">
      <span class="category-icon">{{ category.icon }}</span>
      <div>
        <h1 class="category-title">{{ t(category, 'name') }}</h1>
        <p class="category-desc">{{ t(category, 'description') }}</p>
      </div>
    </div>

    <div class="commands-list">
      <router-link
        v-for="cmd in category.commands"
        :key="cmd.name"
        :to="{ name: 'command', params: { name: cmd.name } }"
        class="command-row"
      >
        <div class="cmd-row-header">
          <code class="cmd-name">{{ cmd.nameEn ? t(cmd, 'name') : cmd.name }}</code>
          <span class="cmd-sub-count" v-if="cmd.subcommands?.length">
            {{ cmd.subcommands.length }} {{ ui('nSubcommands') }}
          </span>
        </div>
        <p class="cmd-desc">{{ t(cmd, 'description') }}</p>
        <div class="cmd-syntax">
          <code>{{ cmd.syntax }}</code>
        </div>
        <div class="cmd-subs" v-if="cmd.subcommands?.length">
          <span v-for="sub in cmd.subcommands.slice(0, 6)" :key="sub.name" class="sub-tag">
            {{ sub.name }}
          </span>
          <span v-if="cmd.subcommands.length > 6" class="sub-more">
            +{{ cmd.subcommands.length - 6 }}
          </span>
        </div>
      </router-link>
    </div>
  </div>
  <div v-else class="not-found">
    <h2>{{ ui('categoryNotFound') }}</h2>
    <router-link to="/">{{ ui('backHome') }}</router-link>
  </div>
</template>

<style scoped>
.category-header {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 32px;
}

.category-icon {
  font-size: 36px;
  flex-shrink: 0;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg-card);
  border-radius: var(--radius-lg);
}

.category-title {
  font-size: 26px;
  font-weight: 700;
  margin-bottom: 4px;
}

.category-desc {
  font-size: 14px;
  color: var(--color-text-secondary);
}

.commands-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.command-row {
  display: block;
  padding: 20px;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  color: var(--color-text);
  transition: all 0.2s;
}

.command-row:hover {
  border-color: var(--color-accent-dim);
  background: var(--color-bg-hover);
}

.cmd-row-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 6px;
  flex-wrap: wrap;
}

.cmd-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-accent-bright);
  background: rgba(255, 90, 45, 0.1);
  padding: 2px 10px;
  border-radius: 4px;
}

.cmd-sub-count {
  font-size: 11px;
  color: var(--color-text-muted);
}

.cmd-desc {
  font-size: 13px;
  color: var(--color-text-secondary);
  margin-bottom: 8px;
}

.cmd-syntax code {
  font-size: 12px;
  color: var(--color-text-muted);
}

.cmd-subs {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 10px;
}

.sub-tag {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: var(--color-text-secondary);
  background: var(--color-bg);
  padding: 2px 8px;
  border-radius: 4px;
}

.sub-more {
  font-size: 11px;
  color: var(--color-text-muted);
  padding: 2px 8px;
}

.not-found {
  text-align: center;
  padding: 60px 0;
}

.not-found h2 {
  margin-bottom: 16px;
  color: var(--color-text-secondary);
}
</style>
