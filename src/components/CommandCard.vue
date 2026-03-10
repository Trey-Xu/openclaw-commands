<script setup>
import { useLocale } from '../composables/useLocale'

defineProps({
  category: Object
})

const { t } = useLocale()
</script>

<template>
  <router-link :to="{ name: 'category', params: { id: category.id } }" class="command-card">
    <div class="card-icon">{{ category.icon }}</div>
    <div class="card-body">
      <h3 class="card-title">{{ t(category, 'name') }}</h3>
      <p class="card-desc">{{ t(category, 'description') }}</p>
      <div class="card-commands">
        <span
          v-for="cmd in category.commands.slice(0, 4)"
          :key="cmd.name"
          class="card-cmd-tag"
        >{{ cmd.name }}</span>
        <span v-if="category.commands.length > 4" class="card-cmd-more">
          +{{ category.commands.length - 4 }}
        </span>
      </div>
    </div>
  </router-link>
</template>

<style scoped>
.command-card {
  display: flex;
  gap: 16px;
  padding: 20px;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  transition: all 0.2s;
  color: var(--color-text);
}

.command-card:hover {
  border-color: var(--color-accent-dim);
  background: var(--color-bg-hover);
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(255, 90, 45, 0.08);
}

.card-icon {
  font-size: 28px;
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg);
  border-radius: var(--radius);
}

.card-body {
  flex: 1;
  min-width: 0;
}

.card-title {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 4px;
}

.card-desc {
  font-size: 13px;
  color: var(--color-text-secondary);
  margin-bottom: 10px;
  line-height: 1.4;
}

.card-commands {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.card-cmd-tag {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: var(--color-accent-bright);
  background: rgba(255, 90, 45, 0.1);
  padding: 2px 8px;
  border-radius: 4px;
}

.card-cmd-more {
  font-size: 11px;
  color: var(--color-text-muted);
  padding: 2px 8px;
}
</style>
