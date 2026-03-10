<script setup>
import { computed } from 'vue'
import { getCommandByName } from '../data/commands'
import { useLocale, useUI } from '../composables/useLocale'
import CodeBlock from '../components/CodeBlock.vue'
import OptionsTable from '../components/OptionsTable.vue'

const props = defineProps({ name: String })
const { t } = useLocale()
const { ui } = useUI()

const command = computed(() => getCommandByName(props.name))
</script>

<template>
  <div class="command-view" v-if="command">
    <nav class="breadcrumb">
      <router-link to="/">{{ ui('home') }}</router-link>
      <span class="sep">/</span>
      <router-link :to="{ name: 'category', params: { id: command.categoryId } }">
        {{ t(command, 'categoryName') }}
      </router-link>
      <span class="sep">/</span>
      <span class="current">{{ command.name }}</span>
    </nav>

    <h1 class="cmd-title">
      <code>{{ command.nameEn ? t(command, 'name') : command.name }}</code>
    </h1>
    <p class="cmd-description">{{ t(command, 'description') }}</p>

    <section class="cmd-section">
      <h2 class="section-heading">{{ ui('syntax') }}</h2>
      <CodeBlock :code="command.syntax" language="bash" />
    </section>

    <section class="cmd-section" v-if="command.subcommands?.length">
      <h2 class="section-heading">{{ ui('subcommands') }}</h2>
      <div class="subcmd-list">
        <div v-for="sub in command.subcommands" :key="sub.name" class="subcmd-item">
          <code class="subcmd-name">{{ sub.name }}</code>
          <span class="subcmd-desc">{{ t(sub, 'description') }}</span>
        </div>
      </div>
    </section>

    <section class="cmd-section" v-if="command.options?.length">
      <h2 class="section-heading">{{ ui('options') }}</h2>
      <OptionsTable :options="command.options" />
    </section>

    <section class="cmd-section" v-if="command.examples?.length">
      <h2 class="section-heading">{{ ui('examples') }}</h2>
      <div v-for="(ex, i) in command.examples" :key="i" class="example-block">
        <p class="example-desc">{{ t(ex, 'description') }}</p>
        <CodeBlock :code="ex.code" language="bash" />
      </div>
    </section>
  </div>

  <div v-else class="not-found">
    <h2>{{ ui('notFoundTitle') }}</h2>
    <p>{{ ui('notFoundCmd') }} <code>{{ name }}</code></p>
    <router-link to="/">{{ ui('backHome') }}</router-link>
  </div>
</template>

<style scoped>
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  margin-bottom: 20px;
  color: var(--color-text-muted);
  flex-wrap: wrap;
}

.breadcrumb a {
  color: var(--color-text-secondary);
}

.breadcrumb a:hover {
  color: var(--color-accent-bright);
}

.sep {
  color: var(--color-border);
}

.current {
  color: var(--color-text);
  font-weight: 500;
}

.cmd-title {
  font-size: 28px;
  margin-bottom: 8px;
}

.cmd-title code {
  font-size: inherit;
  background: none;
  padding: 0;
  color: var(--color-accent);
  font-weight: 700;
}

.cmd-description {
  font-size: 15px;
  color: var(--color-text-secondary);
  margin-bottom: 32px;
  line-height: 1.6;
}

.cmd-section {
  margin-bottom: 32px;
}

.section-heading {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--color-border);
  color: var(--color-text);
}

.subcmd-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  overflow: hidden;
}

.subcmd-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 10px 14px;
  transition: background 0.15s;
}

.subcmd-item:hover {
  background: var(--color-bg-card);
}

.subcmd-item:not(:last-child) {
  border-bottom: 1px solid var(--color-border);
}

.subcmd-name {
  flex-shrink: 0;
  min-width: 180px;
  font-size: 13px;
  font-weight: 500;
}

.subcmd-desc {
  font-size: 13px;
  color: var(--color-text-secondary);
}

.example-block {
  margin-bottom: 16px;
}

.example-desc {
  font-size: 13px;
  color: var(--color-text-secondary);
  margin-bottom: 4px;
  font-weight: 500;
}

.not-found {
  text-align: center;
  padding: 60px 0;
}

.not-found h2 {
  margin-bottom: 8px;
}

.not-found p {
  color: var(--color-text-secondary);
  margin-bottom: 16px;
}

@media (max-width: 768px) {
  .cmd-title { font-size: 22px; }
  .subcmd-item {
    flex-direction: column;
    gap: 4px;
  }
  .subcmd-name { min-width: auto; }
}
</style>
