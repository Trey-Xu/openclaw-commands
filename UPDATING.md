# 随 OpenClaw 更新本参考站

本文档说明当 [OpenClaw](https://github.com/openclaw/openclaw) 发布新版本时，如何更新本命令参考网站。

供 Cursor Agent 使用的逐步清单（Skill）：[`.cursor/skills/openclaw-reference-sync/SKILL.md`](.cursor/skills/openclaw-reference-sync/SKILL.md)。

## 1. 更新版本号

- **`src/config/version.js`**  
  修改 `OPENCLAW_VERSION` 为最新版本（如 `2026.4.10`）。  
  全站「基于 OpenClaw vX.X.X」和版本徽章链接会自动同步。

- **本地对照官方源码（可选）**  
  若已 `git clone` [openclaw/openclaw](https://github.com/openclaw/openclaw) 到本机，可设置环境变量后离线跑校验，无需拉 raw GitHub：  
  `OPENCLAW_LOCAL_REPO=/path/to/openclaw npm run check:cli-sync`  
  可与 `OPENCLAW_OFFICIAL_TAG=v2026.3.28` 联用，表示检出到该 tag 的目录。

## 2. 更新系统要求（如有变更）

- **`src/data/commands/deployment.json`**  
  在「系统要求」命令中，根据官方 README 更新 Node.js 等要求（当前为 Node 24 推荐或 22.14+）。

## 3. 核对命令数据

- 本地安装新版本 CLI：  
  `npm install -g openclaw@latest`
- 运行 `npm run check:cli-sync` / `check:cli-deep-sync`（或加上 `OPENCLAW_LOCAL_REPO` 指向上游仓库）。
- 运行 `openclaw --help` 及各子命令的 `--help`，对照 **`src/data/commands/*.json`**：
  - 新增命令：在对应分类 JSON 中新增条目。
  - 删除/重命名命令：删除或修改对应条目。
  - 选项/子命令/语法变更：更新对应命令的 `syntax`、`options`、`subcommands`、`examples`。
- 可参考官方文档：<https://docs.openclaw.ai/cli>。

## 4. 发布本参考站新版本

- 在 **`CHANGELOG.md`** 的 `[Unreleased]` 下记录本次变更（含 OpenClaw 版本与命令/文案更新）。
- 按 **`RELEASING.md`** 执行：更新 `package.json` 版本号、提交、打 tag、推送。  
  GitHub Actions 会自动部署 Pages 并创建 Release。

## 5. 可选：订阅 OpenClaw 更新

- 在 GitHub 上 Watch [openclaw/openclaw](https://github.com/openclaw/openclaw) 的 Releases，或使用 RSS：  
  `https://github.com/openclaw/openclaw/releases.atom`
