<script setup>
import { ref } from 'vue'
import { useUI } from '../composables/useLocale'

defineProps({
  code: String,
  language: { type: String, default: 'bash' }
})

const { ui } = useUI()
const copied = ref(false)

function copy(code) {
  navigator.clipboard.writeText(code)
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}
</script>

<template>
  <div class="code-block">
    <div class="code-header">
      <span class="code-lang">{{ language }}</span>
      <button class="copy-btn" @click="copy(code)">
        <span v-if="copied">{{ ui('copied') }}</span>
        <span v-else>{{ ui('copy') }}</span>
      </button>
    </div>
    <pre class="code-content"><code>{{ code }}</code></pre>
  </div>
</template>

<style scoped>
.code-block {
  background: var(--color-code-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  overflow: hidden;
  margin: 8px 0;
}

.code-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 12px;
  background: rgba(255,255,255,0.03);
  border-bottom: 1px solid var(--color-border);
}

.code-lang {
  font-size: 11px;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.copy-btn {
  background: none;
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 4px;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.15s;
}

.copy-btn:hover {
  border-color: var(--color-accent-dim);
  color: var(--color-accent-bright);
}

.code-content {
  padding: 14px 16px;
  overflow-x: auto;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 13px;
  line-height: 1.7;
  color: var(--color-text);
}

.code-content code {
  background: none;
  padding: 0;
  font-size: inherit;
  color: inherit;
}
</style>
