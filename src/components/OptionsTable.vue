<script setup>
import { useLocale, useUI } from '../composables/useLocale'

defineProps({
  options: Array
})

const { t } = useLocale()
const { ui } = useUI()
</script>

<template>
  <div class="options-table-wrapper" v-if="options && options.length">
    <table class="options-table">
      <thead>
        <tr>
          <th>{{ ui('optionCol') }}</th>
          <th>{{ ui('descCol') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="opt in options" :key="opt.flag">
          <td class="opt-flag"><code>{{ opt.flag }}</code></td>
          <td class="opt-desc">{{ t(opt, 'description') }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.options-table-wrapper {
  overflow-x: auto;
  margin: 12px 0;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
}

.options-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.options-table th {
  text-align: left;
  padding: 10px 14px;
  background: var(--color-bg-secondary);
  color: var(--color-text-secondary);
  font-weight: 600;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid var(--color-border);
}

.options-table td {
  padding: 10px 14px;
  border-bottom: 1px solid var(--color-border);
  vertical-align: top;
}

.options-table tr:last-child td {
  border-bottom: none;
}

.options-table tr:hover td {
  background: var(--color-bg-hover);
}

.opt-flag code {
  font-size: 12px;
  white-space: nowrap;
}

.opt-desc {
  color: var(--color-text-secondary);
}
</style>
