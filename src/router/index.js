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

function setMeta(title, description) {
  document.title = title
  const desc = document.querySelector('meta[name="description"]')
  const ogTitle = document.querySelector('meta[property="og:title"]')
  const ogDesc = document.querySelector('meta[property="og:description"]')
  if (desc) desc.setAttribute('content', description)
  if (ogTitle) ogTitle.setAttribute('content', title)
  if (ogDesc) ogDesc.setAttribute('content', description)
}

router.afterEach((to) => {
  let title = BASE_TITLE
  let description = 'OpenClaw CLI 命令完整参考手册，分类浏览所有命令的语法、选项和使用示例'
  if (to.name === 'category' && to.params.id) {
    const cat = getCategoryById(to.params.id)
    if (cat) {
      title = `${cat.name} - ${BASE_TITLE}`
      description = cat.description || description
    }
  } else if (to.name === 'command' && to.params.name) {
    const cmd = getCommandByName(to.params.name)
    if (cmd) {
      title = `${cmd.name} - ${BASE_TITLE}`
      description = cmd.description || description
    }
  }
  setMeta(title, description)
})

export default router
