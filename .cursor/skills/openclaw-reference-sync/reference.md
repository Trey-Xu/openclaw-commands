# 同步任务参考清单

## 常改文件

| 区域 | 路径 |
|------|------|
| 跟踪的官方版本 | `src/config/version.js` |
| CLI 校验默认 tag | `scripts/check-official-cli-sync.mjs`, `scripts/check-official-cli-deep-sync.mjs` |
| 命令数据 | `src/data/commands/*.json`, `src/data/commands/index.js` |
| Release Notes 离线包 | `src/data/releases.bundled.json` |
| 本站变更日志 | `CHANGELOG.md` |
| 站点版本 | `package.json`, `package-lock.json` |
| Service Worker | `public/sw.js` |
| 部署说明文案 | `src/data/commands/deployment.json` |
| 对外 README | `README.md`, `README.zh-CN.md` |

## 官方对照源（校验脚本拉取或 LOCAL_REPO）

- `src/cli/program/command-registry.ts` + `command-registry-core.ts` — 顶层命令注册（含 core 拆分）  
- `src/cli/program/register.subclis.ts` + `register.subclis-core.ts` — 子 CLI 注册  
- `src/cli/program/core-command-descriptors.ts` + `subcli-descriptors.ts` — 命令名/别名等描述符（顶层名常在此出现）  
- 深度校验还读：`register.backup.ts`, `register.status-health-sessions.ts`, `update-cli.ts`, `directory-cli.ts`, `mcp-cli.ts`, `qr-cli.ts`

## 提交信息示例

```
chore(release): v1.2.3 — sync OpenClaw CLI reference to v2026.4.1
```

正文可写：对齐命令 JSON；更新 bundled release notes；SW 缓存版本；校验脚本默认 tag。
