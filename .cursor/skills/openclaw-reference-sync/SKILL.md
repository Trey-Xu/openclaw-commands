---
name: openclaw-reference-sync
description: >-
  Syncs the openclaw-commands CLI reference site (Trey-Xu/openclaw-commands) with a new
  openclaw/openclaw release: version constants, command JSON, bundled release notes, checks,
  PWA cache bump, and git release. Use when the user mentions syncing OpenClaw, updating
  the command reference site, OPENCLAW_VERSION, check:cli-sync, or a new official OpenClaw tag.
---

# OpenClaw 参考站与官方发版同步

适用于本仓库（Vue 命令参考站）。上游：<https://github.com/openclaw/openclaw>。

## 版本策略

- **OpenClaw 跟踪版本**：`src/config/version.js` 的 `OPENCLAW_VERSION`（CalVer，无 `v` 前缀）为**唯一真相**。
- **本站版本**：`package.json` 的 `version` 与 `OPENCLAW_VERSION` **保持一致**（同为 CalVer，如 `2026.5.21-alpha.1`）。
- **Git tag**：`v${OPENCLAW_VERSION}`（如 `v2026.5.21-alpha.1`），推送后触发 Release 工作流。
- 校验脚本默认 tag 从 `version.js` **自动推导**；仅调试时用 `OPENCLAW_OFFICIAL_TAG` 覆盖。

## 执行前确认

- 目标官方版本：Release 页最新 tag，或 `OPENCLAW_OFFICIAL_TAG`（带 `v`）。
- 可选：`OPENCLAW_LOCAL_REPO=/abs/path/to/openclaw`（检出到目标 tag），离线跑校验。

## 工作流（按顺序）

1. **版本常量**  
   - 编辑 `src/config/version.js`：`OPENCLAW_VERSION` 与官方 CalVer 一致。  
   - 同步 `package.json` / `package-lock.json` 的 `version` 为同一值。

2. **跑校验并修数据**  
   ```bash
   npm run check:cli-sync
   npm run check:cli-deep-sync
   ```  
   - 缺顶层命令：在 `src/data/commands/*.json` 补齐（更新 `index.js` import/分类若新增文件）。  
   - **extra** 本地命令：以官方 registry + descriptor 文件为准（见 `reference.md`）；官方已移除的 CLI 从本站删除或改 README 说明。  
   - 部署指南类条目用 `"kind": "guide"`，勿计入 CLI 同步。  
   - 对照 Release notes / `--help` 更新 `options`、`subcommands`、`examples`。  
   - 深度校验 spec：`scripts/deep-sync-spec.json`（扩展子命令/flags 时改此文件）。

3. **发行说明与离线 fallback**  
   - `src/data/releases.bundled.json`：在 `releases` 数组**头部**追加新版本。  
   - `CHANGELOG.md`：在 `[Unreleased]` 下记录，或新增 `## [X.Y.Z] - date` 段。  
   - `npm run prebuild` 会由 `generate-feed.mjs` 刷新 `public/feed.xml`（也可单独运行）。

4. **系统要求（若官方 README 变更）**  
   - `src/data/commands/deployment.json` 中 Node 等要求。

5. **文档**  
   - `README.md` / `README.zh-CN.md`：更新「当前跟踪 **vX**」一句；分类表与「已移除 CLI」说明。  
   - `UPDATING.md`：示例版本号可顺手更新。

6. **质量闸门**  
   ```bash
   npm run check
   ```  
   包含：版本一致性、命令 JSON 校验、CLI 同步、深度同步、单测、lint、build。  
   Service Worker 缓存名在 build 时从 `package.json.version` 自动注入，**无需手改** `public/sw.js`。

7. **发布到 GitHub**（见 `RELEASING.md`）  
   ```bash
   git add -A
   git commit -m "chore(release): vA.B.C — sync OpenClaw CLI reference to vA.B.C"
   git tag -a vA.B.C -m "openclaw-commands vA.B.C — OpenClaw vA.B.C"
   git push origin main
   git push origin vA.B.C
   ```

## 故障排查

| 现象 | 处理 |
|------|------|
| `No official command names parsed` | 检查网络；或设 `OPENCLAW_LOCAL_REPO` 指向已 checkout 目标 tag 的 openclaw 克隆 |
| `Failed to load official source … empty` | 上游文件路径变更；更新 `scripts/lib/cli-sync-utils.mjs` 的 `OFFICIAL_REGISTRY_PATHS` |
| `check:version-consistency` 失败 | 对齐 `version.js`、`package.json`、README 跟踪版本句、`releases.bundled.json` 最新项 |
| Missing / extra 命令 | 改命令 JSON；勿把 deployment 指南当 CLI 命令（用 `kind: "guide"`） |

## 环境变量速查

| 变量 | 作用 |
|------|------|
| `OPENCLAW_OFFICIAL_TAG` | 覆盖校验用的官方 tag（默认从 `version.js` 推导） |
| `OPENCLAW_LOCAL_REPO` | 官方仓库根目录，优先读本地文件 |
| `OPENCLAW_COMMANDS_DIR` | 覆盖命令 JSON 目录 |

## 延伸阅读

- 人读维护说明：[UPDATING.md](UPDATING.md)  
- 打 tag 与 Conventional Commits：[RELEASING.md](RELEASING.md)  
- 文件清单与 CI 说明：[reference.md](reference.md)
