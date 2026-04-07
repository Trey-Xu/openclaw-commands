# OpenClaw 命令参考

[English](./README.md)

一个为 [OpenClaw](https://github.com/openclaw/openclaw) 构建的完整 CLI 命令参考网站 —— 你的个人 AI 助手。

## 功能特性

- **40+ 命令** 分为 **9 大类**，包含完整的语法、选项、子命令和使用示例
- **双语支持** —— 中英文一键切换
- **实时搜索** —— 按命令名、描述和子命令关键词搜索（子串匹配）
- **暗色主题** —— 终端风格设计，采用 OpenClaw 龙虾配色方案
- **响应式布局** —— 适配桌面、平板和手机
- **一键复制** —— 代码块一键复制到剪贴板
- **GitHub Pages** —— 通过 GitHub Actions 自动部署
- **PWA** —— 可安装、支持离线
- **RSS** —— [feed.xml](https://trey-xu.github.io/openclaw-commands/feed.xml) 订阅发布更新
- **亮色/暗色主题** —— 头部切换

## 命令分类

| 类别 | 包含命令 |
|------|----------|
| 部署指南 | 安装、卸载、系统要求、快速启动、AI 模型配置、接入聊天渠道、Gateway 管理、远程部署、安全加固 |
| 初始化与配置 | `setup`, `onboard`, `configure`, `config`, `doctor`, `completion` |
| 接入渠道 | `channels` (list/status/logs/add/remove/login/logout) |
| 技能与插件 | `skills`, `plugins`, `hooks` |
| Gateway 服务 | `gateway`, `daemon`, `node`, `nodes`, `devices` |
| Agent 与消息 | `agent`, `agents`, `message`, `acp` |
| 模型管理 | `models` (list/status/set/scan/auth/aliases/fallbacks) |
| 自动化 | `cron`, `webhooks`, `sandbox` |
| 系统与维护 | `status`, `health`, `sessions`, `tasks`, `logs`, `system`, `update`, `reset`, `security`, `secrets`、`qa` 等 |

自 OpenClaw **v2026.3.28** 起（本站当前跟踪 **v2026.4.5**），官方 CLI 已不再提供顶层 `openclaw browser`、`openclaw memory`；浏览器与记忆能力通过 Gateway / Agent 工具使用，详见[官方文档](https://docs.openclaw.ai/)。

## 技术栈

- **Vue 3** (Composition API + `<script setup>`)
- **Vite 5** 构建工具
- **Vue Router 4** (hash 模式，兼容 GitHub Pages)
- **GitHub Actions** 自动化部署

## 开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 生产构建
npm run build

# 预览生产构建
npm run preview
```

## 部署

本项目已配置通过 GitHub Actions 自动部署到 GitHub Pages。

1. 推送到 `main` 分支
2. GitHub Actions 自动构建并部署到 Pages
3. 在仓库 Settings > Pages > Source 中选择 "GitHub Actions"

## 项目结构

```
src/
├── assets/main.css           # 全局样式（暗色主题）
├── components/
│   ├── AppHeader.vue         # 顶部导航 + 搜索 + 语言切换
│   ├── Sidebar.vue           # 可折叠命令树导航
│   ├── CommandCard.vue       # 首页分类卡片
│   ├── CodeBlock.vue         # 代码显示 + 复制按钮
│   └── OptionsTable.vue      # 命令选项表格
├── composables/
│   └── useLocale.js          # i18n 语言管理
├── data/commands/            # JSON 命令数据（11 个类别文件）
├── views/
│   ├── HomeView.vue          # 首页（分类网格）
│   ├── CategoryView.vue      # 分类详情页
│   └── CommandView.vue       # 命令详情页
└── router/index.js           # Vue Router 配置
```

## 数据格式

命令数据以 JSON 文件形式存储在 `src/data/commands/` 下，每个文件包含双语字段：

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

添加或修改命令只需编辑 JSON 文件，无需修改代码。

## 许可证

MIT
