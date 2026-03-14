import { ref, watch } from 'vue'

const THEME_KEY = 'openclaw-theme'
const theme = ref(localStorage.getItem(THEME_KEY) || 'dark')

function applyTheme(value) {
  const el = document.documentElement
  if (value === 'light') {
    el.setAttribute('data-theme', 'light')
  } else {
    el.removeAttribute('data-theme')
  }
}

applyTheme(theme.value)

watch(theme, (value) => {
  localStorage.setItem(THEME_KEY, value)
  applyTheme(value)
})

export function useTheme() {
  function toggleTheme() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }
  return { theme, toggleTheme }
}
