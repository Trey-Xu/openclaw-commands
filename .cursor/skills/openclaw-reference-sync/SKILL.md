---
name: openclaw-reference-sync
description: >-
  Syncs openclaw-commands with openclaw/openclaw releases. Modes: sync-only (default, no git push)
  or release (commit/tag/push when user explicitly asks). Triggers: sync OpenClaw, update CLI
  reference, OPENCLAW_VERSION, check:cli-sync, upstream drift Issue, or npm run detect:drift.
---

# OpenClaw 参考站同步（Agent 版）

仓库：Vue CLI 参考站。上游：<https://github.com/openclaw/openclaw>。

## 模式（必遵）

| 模式 | 何时 | Git |
|------|------|-----|
| **sync-only** | 默认；用户只说「同步/更新参考站」 | **禁止** commit / tag / push，除非用户明确要求 |
| **release** | 用户说「发布/推送/commit/tag」 | 允许 commit → tag `v${OPENCLAW_VERSION}` → push |

## Phase 0 — 探测

```bash
npm run detect:drift          # 或 node scripts/detect-upstream-drift.mjs --json
```

- `status: "current"` → **停止**，报告已是最新。
- `status: "drift"` → 记下 `latestTag`，继续 Phase 1。
- 用户指定 tag 时跳过探测，直接用该 tag。

## Phase 1 —  bump 版本

```bash
node scripts/bump-openclaw-version.mjs vX.Y.Z   # 或 --latest
```

写入：`src/config/version.js`、`package.json`、`package-lock.json`、README 跟踪版本句。  
**不要**再手改校验脚本默认 tag（已从 `version.js` 推导）。

## Phase 2 — 修命令 JSON（循环直到通过）

```bash
npm run check:cli-sync
npm run check:cli-deep-sync
```

| 输出 | 动作 |
|------|------|
| `Missing commands: a, b` | 在对应 JSON 新增条目（见 [reference.md](reference.md) 映射表 + 模板） |
| `Extra local commands: x` | 删除 JSON 条目或改 README「已移除 CLI」 |
| deep-sync 失败 | 改 `src/data/commands/*.json` 和/或 `scripts/deep-sync-spec.json` |

**规则：** 部署指南用 `"kind": "guide"`；顶层对齐 ≠ 全量 `--help` 对齐（deep-sync 仅 6 命令，见 reference）。

## Phase 3 — 发行说明与文档

```bash
node scripts/update-bundled-release.mjs --tag vX.Y.Z   # 或 --latest；可 --zh/--en 覆盖摘要
```

- `CHANGELOG.md`：在 `[Unreleased]` 记录，或新增版本段。
- `README.md` / `README.zh-CN.md`：分类表若有新顶层命令则更新。
- `feed.xml`：由 `npm run prebuild` 自动生成，勿手改。

## Phase 4 — 质量闸门

```bash
npm run check
```

失败 → 修数据/脚本 → 重复 Phase 2–4，直到 exit 0。

## Phase 5 — 发布（仅 release 模式）

```bash
git add -A
git commit -m "chore(release): vA.B.C — sync OpenClaw CLI reference to vA.B.C"
git tag -a vA.B.C -m "openclaw-commands vA.B.C — OpenClaw vA.B.C"
git push origin main
git push origin vA.B.C
```

## Definition of Done

- [ ] `npm run detect:drift` 为 `current`（或目标 tag 已与 `version.js` 一致）
- [ ] `npm run check` exit 0
- [ ] `releases.bundled.json` 最新 `version` = `OPENCLAW_VERSION`
- [ ] sync-only：工作区有改动但未 push（或用户已确认不发布）
- [ ] release：`main` 与 `v${OPENCLAW_VERSION}` 已 push

## 自动化触发

- **GitHub Issue** 标题 `Sync OpenClaw CLI reference to v…` + 标签 `openclaw-sync` → 读本 skill，**sync-only** 跑完全流程，回复 Issue 摘要；不 push 除非 Issue/用户要求 release。
- **upstream-drift 工作流** 每周检测并开 Issue（见 reference.md）。

## 延伸阅读

- 文件清单、JSON 模板、命令映射：[reference.md](reference.md)
- 网络/404/missing 逐步修复：[troubleshooting.md](troubleshooting.md)
- 人读说明：[UPDATING.md](../../UPDATING.md) · 发布：[RELEASING.md](../../RELEASING.md)
