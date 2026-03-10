import { createRouter, createWebHashHistory } from 'vue-router'
import { getCategoryById, getCommandByName } from '../data/commands'
import HomeView from '../views/HomeView.vue'
import CategoryView from '../views/CategoryView.vue'
import CommandView from '../views/CommandView.vue'
import NotFoundView from '../views/NotFoundView.vue'

const BASE_TITLE = 'OpenClaw Command Reference'

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/category/:id', name: 'category', component: CategoryView, props: true },
  { path: '/command/:name', name: 'command', component: CommandView, props: true },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundView },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

router.afterEach((to) => {
  let title = BASE_TITLE
  if (to.name === 'category' && to.params.id) {
    const cat = getCategoryById(to.params.id)
    if (cat) title = `${cat.name} - ${BASE_TITLE}`
  } else if (to.name === 'command' && to.params.name) {
    const cmd = getCommandByName(to.params.name)
    if (cmd) title = `${cmd.name} - ${BASE_TITLE}`
  }
  document.title = title
})

export default router
