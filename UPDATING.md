# 随 OpenClaw 更新本参考站

当 [OpenClaw](https://github.com/openclaw/openclaw) 发布新版本时，更新本命令参考网站。

## Agent 自动化（推荐）

Cursor Agent Skill（完整 Phase + DoD）：

- [SKILL.md](.cursor/skills/openclaw-reference-sync/SKILL.md) — 主流程（sync-only / release）
- [reference.md](.cursor/skills/openclaw-reference-sync/reference.md) — 命令映射、JSON 模板
- [troubleshooting.md](.cursor/skills/openclaw-reference-sync/troubleshooting.md) — 校验失败修复

```bash
npm run detect:drift                              # 是否落后官方 latest
node scripts/bump-openclaw-version.mjs --latest   # bump 版本号 + README
npm run check:cli-sync                            # 修命令 JSON 直到通过
node scripts/update-bundled-release.mjs --latest  # 更新离线 Release Notes
npm run check                                     # 全部门禁
```

GitHub 每周 workflow 检测 drift 时会开带 `openclaw-sync` 标签的 Issue，Agent 可按 Issue 内说明执行。

## 1. 更新版本号

- **`src/config/version.js`** — `OPENCLAW_VERSION`（或用 `npm run bump:openclaw -- vX.Y.Z`）
- **`package.json`** / **`package-lock.json`** — 与上相同 CalVer

可选离线校验：`OPENCLAW_LOCAL_REPO=/path/to/openclaw npm run check:cli-sync`

## 2. 更新系统要求（如有变更）

- **`src/data/commands/deployment.json`** — Node 等（指南条目 `"kind": "guide"`）

## 3. 核对命令数据

- `npm run check:cli-sync` / `check:cli-deep-sync`
- 可选：`npm install -g openclaw@latest` 后 `openclaw --help` 对照 JSON
- 官方文档：<https://docs.openclaw.ai/cli>

## 4. 发布

- **`CHANGELOG.md`**、`npm run check`
- **`RELEASING.md`** — commit、tag `v${version}`、push（仅 release 模式）

## 5. 订阅上游

- Watch [openclaw/openclaw Releases](https://github.com/openclaw/openclaw/releases) 或 RSS：`https://github.com/openclaw/openclaw/releases.atom`
