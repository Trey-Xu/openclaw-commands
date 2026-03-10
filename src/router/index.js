import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CategoryView from '../views/CategoryView.vue'
import CommandView from '../views/CommandView.vue'

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/category/:id', name: 'category', component: CategoryView, props: true },
  { path: '/command/:name', name: 'command', component: CommandView, props: true },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router
