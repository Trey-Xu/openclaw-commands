<script setup>
import { useUI } from '../composables/useLocale'
const { ui } = useUI()
</script>

<template>
  <div class="not-found-page">
    <span class="nf-icon">🦞</span>
    <h1 class="nf-code">404</h1>
    <p class="nf-text">{{ ui('pageNotFound') }}</p>
    <router-link to="/" class="nf-link">{{ ui('backHome') }}</router-link>
  </div>
</template>

<style scoped>
.not-found-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
}

.nf-icon {
  font-size: 56px;
  margin-bottom: 16px;
  opacity: 0.6;
}

.nf-code {
  font-size: 64px;
  font-weight: 800;
  color: var(--color-text-muted);
  line-height: 1;
  margin-bottom: 12px;
}

.nf-text {
  font-size: 15px;
  color: var(--color-text-secondary);
  margin-bottom: 24px;
}

.nf-link {
  font-size: 14px;
  padding: 8px 20px;
  border: 1px solid var(--color-accent-dim);
  border-radius: var(--radius);
  color: var(--color-accent-bright);
  transition: all 0.2s;
}

.nf-link:hover {
  background: rgba(255, 90, 45, 0.1);
}
</style>
