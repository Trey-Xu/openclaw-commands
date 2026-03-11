<script setup>
import { ref, computed } from 'vue'
import Prism from 'prismjs'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-json'
import { useUI } from '../composables/useLocale'

const props = defineProps({
  code: String,
  language: { type: String, default: 'bash' }
})

const { ui } = useUI()
const copied = ref(false)

const highlightedCode = computed(() => {
  if (!props.code) return ''
  const lang = props.language === 'bash' ? 'bash' : props.language
  const grammar = Prism.languages[lang] || Prism.languages.bash
  return Prism.highlight(props.code, grammar, lang)
})

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
    <pre class="code-content"><code class="language-bash" v-html="highlightedCode"></code></pre>
  </div>
</template>

<style scoped>
.code-block {
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
  background: transparent !important;
}

.code-content :deep(code) {
  background: transparent !important;
  padding: 0;
  font-size: inherit;
}

/* Override Prism theme for dark consistency */
.code-content :deep(.token.comment),
.code-content :deep(.token.prolog),
.code-content :deep(.token.doctype),
.code-content :deep(.token.cdata) {
  color: #6a737d;
}

.code-content :deep(.token.string),
.code-content :deep(.token.attr-value) {
  color: #9ecbff;
}

.code-content :deep(.token.keyword),
.code-content :deep(.token.operator) {
  color: #ff7b72;
}

.code-content :deep(.token.function),
.code-content :deep(.token.class-name) {
  color: #d2a8ff;
}

.code-content :deep(.token.variable),
.code-content :deep(.token.punctuation) {
  color: #e4e4e7;
}
</style>
