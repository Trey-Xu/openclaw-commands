# 同步任务参考清单

## 常改文件

| 区域 | 路径 |
|------|------|
| 跟踪的官方版本（唯一真相） | `src/config/version.js` |
| 命令数据 | `src/data/commands/*.json`, `src/data/commands/index.js` |
| 深度校验 spec | `scripts/deep-sync-spec.json` |
| Release Notes 离线包 | `src/data/releases.bundled.json` |
| 本站变更日志 | `CHANGELOG.md` |
| 站点版本 | `package.json`, `package-lock.json` |
| Service Worker 源模板 | `public/sw.js`（CACHE 在 build 时自动注入） |
| RSS | `public/feed.xml`（`npm run prebuild` 从 CHANGELOG 生成） |
| 部署说明文案 | `src/data/commands/deployment.json`（指南条目 `kind: "guide"`） |
| 对外 README | `README.md`, `README.zh-CN.md` |

## 官方对照源（校验脚本拉取或 LOCAL_REPO）

- `src/cli/program/command-registry.ts` + `command-registry-core.ts`  
- `src/cli/program/register.subclis.ts` + `register.subclis-core.ts`  
- `src/cli/program/core-command-descriptors.ts` + `subcli-descriptors.ts`  
- 深度校验还读：`scripts/deep-sync-spec.json` 中列出的各 `register.*.ts` / `*-cli.ts`

## 校验命令

```bash
npm run check                    # 全部门禁
npm run check:version-consistency
npm run check:commands
npm run check:cli-sync
npm run check:cli-deep-sync
npm run test
```

## 版本一致性检查项

| 文件 | 字段 / 内容 | 期望 |
|------|-------------|------|
| `src/config/version.js` | `OPENCLAW_VERSION` | 官方 CalVer |
| `package.json` | `version` | 与上相同 |
| `README.md` / `README.zh-CN.md` | `当前跟踪 **vX**` | `v${OPENCLAW_VERSION}` |
| `releases.bundled.json` | `releases[0].version` | 与上相同 |

## CI / 部署

- `.github/workflows/quality-gates.yml` — 可复用质量闸门（CI 与 Pages 部署均调用）  
- `.github/workflows/upstream-drift.yml` — 每周对比官方 latest release（仅 warning）  
- **勿提交**：`SYNC_REPORT.md`、`memory/`（已 gitignore）

## 共享脚本库

| 模块 | 路径 |
|------|------|
| 版本读取 | `scripts/lib/version.mjs` |
| 同步工具 | `scripts/lib/cli-sync-utils.mjs` |
| TS 解析（可单测） | `scripts/lib/cli-parsers.mjs` |

## 提交信息示例

```
chore(release): v2026.5.21-alpha.1 — sync OpenClaw CLI reference to v2026.5.21-alpha.1
```

正文可写：对齐命令 JSON；更新 bundled release notes；校验与 CI 闸门。
