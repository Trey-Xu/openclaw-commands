import deployment from './deployment.json'
import setup from './setup.json'
import channels from './channels.json'
import skills from './skills.json'
import gateway from './gateway.json'
import agent from './agent.json'
import models from './models.json'
import memory from './memory.json'
import browser from './browser.json'
import automation from './automation.json'
import system from './system.json'

export const categories = [
  deployment,
  setup,
  channels,
  skills,
  gateway,
  agent,
  models,
  memory,
  browser,
  automation,
  system
]

export function getAllCommands() {
  return categories.flatMap(cat =>
    cat.commands.map(cmd => ({
      ...cmd,
      categoryId: cat.id,
      categoryName: cat.name,
      categoryNameEn: cat.nameEn
    }))
  )
}

export function getCategoryById(id) {
  return categories.find(cat => cat.id === id)
}

export function getCommandByName(name) {
  const decoded = decodeURIComponent(name)
  for (const cat of categories) {
    const cmd = cat.commands.find(c => c.name === decoded || c.nameEn === decoded)
    if (cmd) return {
      ...cmd,
      categoryId: cat.id,
      categoryName: cat.name,
      categoryNameEn: cat.nameEn
    }
  }
  return null
}

export function searchCommands(query) {
  if (!query) return []
  const q = query.toLowerCase()
  return getAllCommands().filter(cmd => {
    if (cmd.name.toLowerCase().includes(q)) return true
    if (cmd.nameEn?.toLowerCase().includes(q)) return true
    if (cmd.description.toLowerCase().includes(q)) return true
    if (cmd.descriptionEn?.toLowerCase().includes(q)) return true
    if (cmd.subcommands?.some(sub =>
      sub.name.toLowerCase().includes(q) ||
      sub.description.toLowerCase().includes(q) ||
      sub.descriptionEn?.toLowerCase().includes(q)
    )) return true
    return false
  })
}
