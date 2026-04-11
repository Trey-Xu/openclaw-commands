# OpenClaw Command Reference

[中文文档](./README.zh-CN.md)

A comprehensive CLI command reference website for [OpenClaw](https://github.com/openclaw/openclaw) — your personal AI assistant.

## Features

- **40+ commands** organized into **9 categories** with full syntax, options, subcommands, and examples
- **Bilingual support** — switch between Chinese and English with one click
- **Real-time search** — search across command names, descriptions, and subcommands (substring match)
- **Dark theme** — terminal-inspired design with OpenClaw's lobster color palette
- **Responsive** — works on desktop, tablet, and mobile
- **Copy to clipboard** — one-click code block copying
- **GitHub Pages** — auto-deployed via GitHub Actions
- **PWA** — installable, offline-capable
- **RSS** — [feed.xml](https://trey-xu.github.io/openclaw-commands/feed.xml) for release updates
- **Light/Dark theme** — toggle in header

## Command Categories

| Category | Commands |
|----------|----------|
| Deployment Guide | Install, Uninstall, System Requirements, Quick Start, AI Models, Chat Channels, Gateway, Remote, Security |
| Setup & Configuration | `setup`, `onboard`, `configure`, `config`, `doctor`, `completion` |
| Channels | `channels` (list/status/logs/add/remove/login/logout) |
| Skills & Plugins | `skills`, `plugins`, `hooks` |
| Gateway & Services | `gateway`, `daemon`, `node`, `nodes`, `devices` |
| Agent & Messaging | `agent`, `agents`, `message`, `acp` |
| Model Management | `models`, `infer`, `capability` (list/status/set/scan/auth/aliases/fallbacks + provider capabilities) |
| Automation | `cron`, `webhooks`, `sandbox` |
| System & Maintenance | `status`, `health`, `sessions`, `tasks`, `logs`, `system`, `update`, `reset`, `security`, `secrets`, `exec-policy`, `qa`, and more |

OpenClaw **v2026.3.28+** (current reference **v2026.4.10**) no longer exposes top-level `openclaw browser` or `openclaw memory` CLI commands; browser control and memory features are integrated via the Gateway and agent tools (see [official docs](https://docs.openclaw.ai/)).

## Tech Stack

- **Vue 3** (Composition API + `<script setup>`)
- **Vite 5** build tool
- **Vue Router 4** (hash mode for GitHub Pages compatibility)
- **GitHub Actions** for automated deployment

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

This project is configured for automatic deployment to GitHub Pages via GitHub Actions.

1. Push to the `main` branch
2. GitHub Actions builds and deploys to Pages automatically
3. Enable GitHub Pages in repository Settings > Pages > Source: "GitHub Actions"

## Project Structure

```
src/
├── assets/main.css           # Global styles (dark theme)
├── components/
│   ├── AppHeader.vue         # Header with search + language toggle
│   ├── Sidebar.vue           # Collapsible command tree navigation
│   ├── CommandCard.vue       # Category card for homepage
│   ├── CodeBlock.vue         # Code display with copy button
│   └── OptionsTable.vue      # Command options table
├── composables/
│   └── useLocale.js          # i18n locale management
├── data/commands/            # JSON command data (11 category files)
├── views/
│   ├── HomeView.vue          # Homepage with category grid
│   ├── CategoryView.vue      # Category detail page
│   └── CommandView.vue       # Command detail page
└── router/index.js           # Vue Router config
```

## Data Format

Command data is stored in JSON files under `src/data/commands/`. Each file contains bilingual fields:

```json
{
  "name": "setup",
  "description": "初始化配置和工作区",
  "descriptionEn": "Initialize config and workspace",
  "syntax": "openclaw setup [options]",
  "options": [...],
  "examples": [...],
  "subcommands": [...]
}
```

To add or modify commands, simply edit the JSON files — no code changes required.

## License

MIT
