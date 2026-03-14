<script setup>
import { ref } from 'vue'
import { OPENCLAW_VERSION, OPENCLAW_RELEASE_URL } from './config/version'
import AppHeader from './components/AppHeader.vue'
import Sidebar from './components/Sidebar.vue'
import BackToTop from './components/BackToTop.vue'
import { useLocale } from './composables/useLocale'

const sidebarOpen = ref(false)
const { locale } = useLocale()
</script>

<template>
  <a href="#main-content" class="skip-link">{{ locale === 'zh' ? '跳到主内容' : 'Skip to main content' }}</a>
  <AppHeader @toggle-sidebar="sidebarOpen = !sidebarOpen" />
  <div class="app-layout">
    <Sidebar :open="sidebarOpen" @close="sidebarOpen = false" />
    <main id="main-content" class="main-content" tabindex="-1">
      <router-view v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" />
        </Transition>
      </router-view>
      <footer class="site-footer">
        <span>
          {{ locale === 'zh' ? '基于 OpenClaw' : 'Based on OpenClaw' }}
          <a :href="OPENCLAW_RELEASE_URL" target="_blank">v{{ OPENCLAW_VERSION }}</a>
        </span>
        <span class="footer-sep">·</span>
        <a href="https://docs.openclaw.ai/cli" target="_blank">
          {{ locale === 'zh' ? '官方文档' : 'Official Docs' }}
        </a>
        <span class="footer-sep">·</span>
        <a href="https://github.com/Trey-Xu/openclaw-commands" target="_blank">GitHub</a>
      </footer>
    </main>
  </div>
  <BackToTop />
</template>

<style>
.skip-link {
  position: absolute;
  top: -100px;
  left: 8px;
  z-index: 200;
  padding: 8px 16px;
  background: var(--color-accent);
  color: #fff;
  font-size: 14px;
  border-radius: var(--radius);
  transition: top 0.2s;
}
.skip-link:focus {
  top: 12px;
  outline: 2px solid #fff;
  outline-offset: 2px;
}

.site-footer {
  margin-top: 48px;
  padding: 20px 0;
  border-top: 1px solid var(--color-border);
  font-size: 12px;
  color: var(--color-text-muted);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 6px;
  flex-wrap: wrap;
}

.site-footer a {
  color: var(--color-text-secondary);
  font-size: 12px;
}

.site-footer a:hover {
  color: var(--color-accent-bright);
}

.footer-sep {
  color: var(--color-border);
}

.page-enter-active,
.page-leave-active {
  transition: opacity 0.15s ease;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style>
