import { createRouter, createWebHashHistory } from 'vue-router'
import { getCategoryById, getCommandByName } from '../data/commands'

const BASE_TITLE = 'OpenClaw Command Reference'

const routes = [
  { path: '/', name: 'home', component: () => import('../views/HomeView.vue') },
  { path: '/releases/:tag?', name: 'releases', component: () => import('../views/ReleaseNotesView.vue'), props: true },
  { path: '/category/:id', name: 'category', component: () => import('../views/CategoryView.vue'), props: true },
  { path: '/command/:name', name: 'command', component: () => import('../views/CommandView.vue'), props: true },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('../views/NotFoundView.vue') },
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
  if (to.name === 'releases') {
    title = `Release Notes - ${BASE_TITLE}`
    description = '按版本查看 OpenClaw 的更新内容（来自 GitHub Releases）'
  } else if (to.name === 'category' && to.params.id) {
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
