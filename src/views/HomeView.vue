<script setup>
import { categories, getAllCommands } from '../data/commands'
import { useLocale, useUI } from '../composables/useLocale'
import CommandCard from '../components/CommandCard.vue'

const { t } = useLocale()
const { ui } = useUI()

const allCommands = getAllCommands()
const totalSubcommands = allCommands.reduce((sum, cmd) => sum + (cmd.subcommands?.length || 0), 0)

const globalFlags = [
  { flag: '-V, --version', description: '打印版本并退出', descriptionEn: 'Print version and exit' },
  { flag: '--no-color', description: '禁用 ANSI 颜色', descriptionEn: 'Disable ANSI colors' },
  { flag: '--profile <name>', description: '在自定义目录下隔离状态', descriptionEn: 'Isolate state under custom directory' },
  { flag: '--dev', description: '开发模式，使用开发配置和端口偏移', descriptionEn: 'Dev mode with dev config and port shift' },
  { flag: '--update', description: '更新快捷方式 (源码安装)', descriptionEn: 'Update shorthand (source installs)' },
  { flag: '--json', description: 'JSON 输出（多数命令支持）', descriptionEn: 'JSON output (most commands)' },
]
</script>

<template>
  <div class="home">
    <section class="hero">
      <div class="hero-badge">{{ ui('heroBadge') }}</div>
      <h1 class="hero-title">
        <span class="hero-icon">🦞</span>
        {{ ui('heroTitle') }}
      </h1>
      <p class="hero-desc">
        <strong>{{ categories.length }}</strong> {{ ui('heroCategories') }} ·
        <strong>{{ allCommands.length }}</strong> {{ ui('heroCommands') }} ·
        <strong>{{ totalSubcommands }}</strong> {{ ui('heroSubcommands') }}
        {{ ui('heroSuffix') }}
      </p>
    </section>

    <section class="global-flags">
      <h2 class="section-title">{{ ui('globalFlags') }}</h2>
      <div class="flags-grid">
        <div v-for="f in globalFlags" :key="f.flag" class="flag-item">
          <code>{{ f.flag }}</code>
          <span>{{ t(f, 'description') }}</span>
        </div>
      </div>
    </section>

    <section class="categories-section">
      <h2 class="section-title">{{ ui('commandCategories') }}</h2>
      <div class="categories-grid">
        <CommandCard
          v-for="cat in categories"
          :key="cat.id"
          :category="cat"
        />
      </div>
    </section>
  </div>
</template>

<style scoped>
.home {
  width: 100%;
}

.hero {
  padding: 24px 0 32px;
}

.hero-badge {
  display: inline-block;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: var(--color-accent);
  background: rgba(255, 90, 45, 0.1);
  padding: 4px 12px;
  border-radius: 20px;
  margin-bottom: 16px;
  font-weight: 600;
}

.hero-title {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.hero-icon {
  font-size: 36px;
}

.hero-desc {
  font-size: 15px;
  color: var(--color-text-secondary);
  line-height: 1.6;
}

.hero-desc strong {
  color: var(--color-accent-bright);
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--color-border);
}

.global-flags {
  margin-bottom: 40px;
}

.flags-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 8px;
}

.flag-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  background: var(--color-bg-card);
  border-radius: var(--radius);
  font-size: 13px;
}

.flag-item code {
  flex-shrink: 0;
  font-size: 12px;
}

.flag-item span {
  color: var(--color-text-secondary);
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 16px;
}

@media (max-width: 768px) {
  .hero-title { font-size: 22px; }
  .categories-grid { grid-template-columns: 1fr; }
  .flags-grid { grid-template-columns: 1fr; }
}
</style>
