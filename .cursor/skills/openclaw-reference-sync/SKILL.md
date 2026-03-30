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

## 目标

在官方发布新 tag（如 `v2026.3.28`）后，让本站跟踪版本、命令数据与校验脚本一致，并按语义版本发布本站（如 `1.2.3`），推送到 GitHub 触发 Pages / Release 工作流。

## 执行前确认

- 目标官方版本：Release 页或 `OPENCLAW_OFFICIAL_TAG`（形如 `v2026.3.28`，带 `v`）。
- 可选：本机已克隆 `openclaw`，设 `OPENCLAW_LOCAL_REPO=/abs/path/to/openclaw`（检出到目标 tag），校验时不依赖 raw GitHub。

## 工作流（按顺序）

1. **版本常量**  
   - 编辑 `src/config/version.js`：`OPENCLAW_VERSION` 与官方 CalVer 一致（无 `v` 前缀）。

2. **校验脚本默认 tag**  
   - `scripts/check-official-cli-sync.mjs`  
   - `scripts/check-official-cli-deep-sync.mjs`  
   - 将默认 `OPENCLAW_OFFICIAL_TAG` 改为新 `vX.Y.Z`（与官方 tag 一致）。

3. **跑校验并修数据**  
   ```bash
   npm run check:cli-sync
   npm run check:cli-deep-sync
   ```  
   - 若缺顶层命令：在 `src/data/commands/*.json` 中补齐（勿忘 `src/data/commands/index.js` 的 import/分类）。  
   - 若 **extra** 本地多出的顶层命令：以官方 `command-registry.ts` + `register.subclis.ts` 为准；官方已移除的 CLI 应从本站删除或改为 README 说明（勿保留失效的 `openclaw foo`）。  
   - 对照 Release notes / `--help` 更新 `options`、`subcommands`、`examples`。

4. **发行说明与离线 fallback**  
   - `src/data/releases.bundled.json`：在数组**头部**追加新版本的 `tagName` / `version` / `url` / `sections`（中英 bullet）。  
   - `CHANGELOG.md`：新增本站版本小节（含 OpenClaw 版本与数据变更摘要）。

5. **系统要求（若官方 README 变更）**  
   - `src/data/commands/deployment.json` 中 Node 等要求。

6. **本站版本号与 PWA**  
   - `package.json`（及锁文件）：`npm install` 或 `--package-lock-only` 同步 `package-lock.json`。  
   - `public/sw.js`：递增 `CACHE` 名（如 `openclaw-commands-vN`），降低 Pages 用户命中旧 `index.html` 缓存的概率。

7. **文档**  
   - `README.md` / `README.zh-CN.md`：分类数、命令表与「已移除 CLI」等说明保持一致。  
   - `UPDATING.md`：示例版本号可顺手更新。

8. **质量闸门**  
   ```bash
   npm run lint
   npm run build
   ```

9. **发布到 GitHub**（见 `RELEASING.md`）  
   ```bash
   git add -A
   git commit -m "chore(release): vX.Y.Z — sync OpenClaw CLI reference to vA.B.C"
   git tag -a vX.Y.Z -m "openclaw-commands vX.Y.Z — OpenClaw vA.B.C"
   git push origin main
   git push origin vX.Y.Z
   ```

## 环境变量速查

| 变量 | 作用 |
|------|------|
| `OPENCLAW_OFFICIAL_TAG` | 覆盖校验用的官方 tag（默认已在脚本里） |
| `OPENCLAW_LOCAL_REPO` | 官方仓库根目录，优先读本地文件而非 fetch |
| `OPENCLAW_COMMANDS_DIR` | 覆盖命令 JSON 目录（默认 `src/data/commands`） |

## 延伸阅读

- 人读维护说明：[UPDATING.md](UPDATING.md)  
- 打 tag 与 Conventional Commits：[RELEASING.md](RELEASING.md)  
- 更深文件清单：[reference.md](reference.md)
