# 同步参考清单（Agent）

## 一键脚本

| 命令 | 作用 |
|------|------|
| `npm run detect:drift` | 对比官方 latest vs 本站 `version.js` |
| `node scripts/bump-openclaw-version.mjs vX` / `--latest` | bump 版本 + README 跟踪句 |
| `node scripts/update-bundled-release.mjs --tag vX` / `--latest` | 头部追加 bundled release |
| `npm run check` | 全部门禁 |

## 常改文件

| 区域 | 路径 |
|------|------|
| 版本唯一真相 | `src/config/version.js` |
| 命令数据 | `src/data/commands/*.json`, `index.js` |
| 深度校验 spec | `scripts/deep-sync-spec.json` |
| 离线 Release Notes | `src/data/releases.bundled.json` |
| 变更日志 | `CHANGELOG.md` |
| 站点版本 | `package.json`, `package-lock.json` |

## 顶层命令 → JSON 文件（新增时用）

| 文件 | 典型顶层命令 |
|------|----------------|
| `setup.json` | `crestodian`, `setup`, `onboard`, `configure`, `config`, `migrate`, `doctor`, `completion` |
| `channels.json` | `channels`, `pairing`, `directory`（若仅渠道相关可放 channels；当前 directory 在 system.json） |
| `skills.json` | `skills`, `plugins`, `hooks` |
| `gateway.json` | `gateway`, `daemon`, `node`, `nodes`, `devices`, `dns` |
| `agent.json` | `agent`, `agents`, `message`, `acp`, `mcp` |
| `models.json` | `models`, `infer`, `capability` |
| `automation.json` | `cron`, `webhooks`, `sandbox` |
| `system.json` | `status`, `health`, `sessions`, `commitments`, `tasks`, `logs`, `system`, `backup`, `update`, `reset`, `security`, `secrets`, `exec-policy`, `approvals`, `qa`, `proxy`, `tui`, `terminal`, `chat`, `dashboard`, `directory`, `qr`, `docs`, `clawbot`, `uninstall` |
| `deployment.json` | **仅** `"kind": "guide"` 部署指南，不计入 CLI sync |

不确定时：拉官方 `core-command-descriptors.ts` / `subcli-descriptors.ts` 看描述，或按语义最接近的分类放入。

## CLI 命令 JSON 最小模板

```json
{
  "name": "example",
  "description": "中文简述",
  "descriptionEn": "English summary",
  "syntax": "openclaw example [options]",
  "options": [
    { "flag": "--json", "description": "JSON 输出", "descriptionEn": "JSON output" }
  ],
  "examples": [
    { "description": "示例说明", "descriptionEn": "Example", "code": "openclaw example --json" }
  ],
  "subcommands": []
}
```

有子命令时在 `subcommands` 加 `{ "name", "description", "descriptionEn" }`；语法含子命令时用 `openclaw foo <subcommand> [options]`。

## 部署指南模板（不计入 sync）

```json
{
  "kind": "guide",
  "name": "安装 OpenClaw",
  "nameEn": "Install OpenClaw",
  "description": "...",
  "descriptionEn": "...",
  "syntax": "...",
  "options": [],
  "examples": [],
  "subcommands": []
}
```

## releases.bundled.json 条目模板

```json
{
  "tagName": "v2026.5.21-alpha.1",
  "version": "2026.5.21-alpha.1",
  "publishedAt": "2026-05-22",
  "url": "https://github.com/openclaw/openclaw/releases/tag/v2026.5.21-alpha.1",
  "sections": [
    {
      "title": "Changes",
      "items": [
        { "zh": "中文要点", "en": "English bullet" }
      ]
    }
  ]
}
```

优先用 `node scripts/update-bundled-release.mjs --tag vX`；Agent 可后补 `zh` 翻译。

## 官方 registry 路径

**必需：** `command-registry.ts`, `register.subclis.ts`  
**可选：** `core-command-descriptors.ts`, `subcli-descriptors.ts`, `command-registry-core.ts`, `register.subclis-core.ts`  
**deep-sync：** `scripts/deep-sync-spec.json` 中的 `*-cli.ts` / `register.*.ts`

## 版本一致性（`check:version-consistency`）

| 文件 | 期望 |
|------|------|
| `version.js` | `OPENCLAW_VERSION` |
| `package.json` | 同上 |
| README / README.zh-CN | 含 `**v${OPENCLAW_VERSION}**` |
| `releases.bundled.json` | `releases[0].version` 同上 |

## deep-sync 范围说明

仅校验 spec 内 6 个命令的子命令与 flags：`update`, `qr`, `mcp`, `directory`, `backup`, `sessions`。  
`check:cli-sync` 通过只代表 **顶层命令名** 对齐；其余子命令/选项需 Release notes、`openclaw <cmd> --help` 或扩展 spec。

## CI / 自动化

- `quality-gates.yml` — CI 与 Pages 共用
- `upstream-drift.yml` — 检测 drift 并开 Issue（标签 `openclaw-sync`）
- 勿提交：`SYNC_REPORT.md`, `memory/`

## Issue 触发标准 Prompt

```
目标：将 openclaw-commands 同步到 OpenClaw {latestTag}。
模式：sync-only（不要 push，除非本 Issue 明确要求 release）。
请阅读并执行 .cursor/skills/openclaw-reference-sync/SKILL.md 全部 Phase。
完成后回复：变更摘要、npm run check 结果、是否 ready to release。
```

## 提交信息

```
chore(release): v2026.5.21-alpha.1 — sync OpenClaw CLI reference to v2026.5.21-alpha.1
```
