# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.2.7] - 2026-05-07

### Changed

- **OpenClaw 版本**: 跟踪至 [v2026.5.5](https://github.com/openclaw/openclaw/releases/tag/v2026.5.5)
- **命令参考**: 同步 v2026.5.5 — 自动同步官方最新版本
- **校验脚本**: 默认 tag `v2026.5.5`

---

## [1.2.6] - 2026-04-22

### Changed

- **OpenClaw 版本**: 跟踪至 [v2026.4.21](https://github.com/openclaw/openclaw/releases/tag/v2026.4.21)
- **命令参考**: 同步 v2026.4.21 — OpenAI/images 图像生成改进、Plugins/doctor 修复、Image generation 日志优化、Auth/commands 权限修复、Slack 线程别名保留、Browser 可访问性引用修复、npm/install 依赖链优化
- **校验脚本**: 默认 tag `v2026.4.21`

## [1.2.5] - 2026-04-11

### Fixed

- **PWA**: Service Worker 缓存版本升为 `openclaw-commands-v6`

### Changed

- **OpenClaw 版本**: 跟踪至 [v2026.4.10](https://github.com/openclaw/openclaw/releases/tag/v2026.4.10)
- **命令参考**: 新增 `infer` / `capability`、`exec-policy`；`qa` 补充 matrix/telegram/suite multipass；`qr` 文案与官方一致；**CLI 同步脚本**支持上游拆分后的 `core-command-descriptors.ts`、`subcli-descriptors.ts`、`command-registry-core.ts`、`register.subclis-core.ts`
- **校验脚本**: 默认 tag `v2026.4.10`

## [1.2.4] - 2026-04-06

### Fixed

- **PWA**: Service Worker 缓存版本升为 `openclaw-commands-v5`

### Changed

- **OpenClaw 版本**: 跟踪至 [v2026.4.5](https://github.com/openclaw/openclaw/releases/tag/v2026.4.5)
- **命令参考**: 新增顶层 `qa` 及子命令；`plugins install` 说明 `--force`；校验脚本默认 tag `v2026.4.5`

## [1.2.3] - 2026-04-01

### Fixed

- **PWA**: Service Worker 缓存版本升为 `openclaw-commands-v4`

### Changed

- **OpenClaw 版本**: 跟踪至 [v2026.4.1](https://github.com/openclaw/openclaw/releases/tag/v2026.4.1)
- **命令参考**: 新增顶层 `tasks`（list / audit / maintenance / show / notify / cancel）；`cron` 补充 `--tools` 工具白名单说明；校验脚本默认 tag `v2026.4.1`

## [1.2.2] - 2026-03-30

### Fixed

- **PWA**: Service Worker 缓存版本升为 `openclaw-commands-v3`，避免已安装用户长期命中旧缓存

### Changed

- **OpenClaw 版本**: 跟踪至 [v2026.3.28](https://github.com/openclaw/openclaw/releases/tag/v2026.3.28)
- **命令参考**: 新增 `config schema`；`gateway run` 补充 `--cli-backend-logs` / `--claude-cli-logs`（弃用别名）、`--password-file`、`--ws-log`、`--raw-stream` 等；移除已不在官方 CLI 中的顶层 `browser`、`memory` 分类（见 README 说明）
- **校验脚本**: 默认对比官方 tag `v2026.3.28`；支持 `OPENCLAW_LOCAL_REPO` 从本机 openclaw 源码目录读取，便于离线对照

### Documentation

- **UPDATING.md**: 补充本地源码目录与校验命令的用法

## [1.2.1] - 2026-03-26

### Fixed

- **GitHub Pages**: 调整 Service Worker 缓存策略，避免发布新版本后因缓存旧 `index.html` 导致白屏

## [1.2.0] - 2026-03-26

### Added

- **版本注记**: 新增「Release Notes」页面（GitHub Releases 拉取 + 离线 fallback），支持按版本切换与中英文显示
- **同步校验**: 新增 `check:cli-sync` / `check:cli-deep-sync` 并接入 CI，防止命令参考与官方差异扩大
- **无障碍**: 键盘焦点 `:focus-visible` 样式、跳过主内容链接
- **性能**: 首屏字体 preload、路由懒加载
- **PWA**: manifest + Service Worker，可安装与离线访问
- **RSS**: `feed.xml` 发布订阅
- **主题**: 亮色/暗色切换（localStorage 记忆）
- **维护**: `UPDATING.md` 随 OpenClaw 更新说明

### Changed

- **文案**: 移除未使用的 copyLink/linkCopied；README 11 大类、搜索说明改为「子串匹配」
- **OpenClaw 版本**: 跟踪至 [v2026.3.24](https://github.com/openclaw/openclaw/releases/tag/v2026.3.24)（Latest）
- **系统要求**: 与官方一致 — Node **24**（推荐）或 **22.14+**（见 [openclaw/openclaw](https://github.com/openclaw/openclaw) README）
- **命令参考**: 同步 [v2026.3.24](https://github.com/openclaw/openclaw/releases/tag/v2026.3.24) — `openclaw update` 预检 Node、`--container`/`OPENCLAW_CONTAINER`、skills「needs setup」与 `skills info` 指引；补齐并对齐 `update/backup/sessions/directory/mcp/qr` 等常用子命令与 flags

## [1.1.0] - 2025-03-11

### Added

- **CodeBlock**: Prism.js 语法高亮（bash/shell）
- **Deployment**: 部署指南新增「卸载 OpenClaw」
- **Search**: 搜索结果关键词高亮（命令名、描述）
