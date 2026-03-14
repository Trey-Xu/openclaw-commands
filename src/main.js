import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/main.css'

const savedTheme = localStorage.getItem('openclaw-theme')
if (savedTheme === 'light') {
  document.documentElement.setAttribute('data-theme', 'light')
}

createApp(App).use(router).mount('#app')

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(import.meta.env.BASE_URL + 'sw.js').catch(() => {})
  })
}
