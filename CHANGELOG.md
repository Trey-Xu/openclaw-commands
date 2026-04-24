## [v2026.4.23] - 2026-04-25

- Auto-synced from official OpenClaw repository
- Updated CLI command reference

---

     1|# Changelog
     2|
     3|All notable changes to this project will be documented in this file.
     4|
     5|The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
     6|and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
     7|
     8|## [Unreleased]
     9|
    10|## [1.2.6] - 2026-04-22
    11|
    12|### Changed
    13|
    14|- **OpenClaw 版本**: 跟踪至 [v2026.4.21](https://github.com/openclaw/openclaw/releases/tag/v2026.4.21)
    15|- **命令参考**: 同步 v2026.4.21 — OpenAI/images 图像生成改进、Plugins/doctor 修复、Image generation 日志优化、Auth/commands 权限修复、Slack 线程别名保留、Browser 可访问性引用修复、npm/install 依赖链优化
    16|- **校验脚本**: 默认 tag `v2026.4.21`
    17|
    18|## [1.2.5] - 2026-04-11
    19|
    20|### Fixed
    21|
    22|- **PWA**: Service Worker 缓存版本升为 `openclaw-commands-v6`
    23|
    24|### Changed
    25|
    26|- **OpenClaw 版本**: 跟踪至 [v2026.4.10](https://github.com/openclaw/openclaw/releases/tag/v2026.4.10)
    27|- **命令参考**: 新增 `infer` / `capability`、`exec-policy`；`qa` 补充 matrix/telegram/suite multipass；`qr` 文案与官方一致；**CLI 同步脚本**支持上游拆分后的 `core-command-descriptors.ts`、`subcli-descriptors.ts`、`command-registry-core.ts`、`register.subclis-core.ts`
    28|- **校验脚本**: 默认 tag `v2026.4.10`
    29|
    30|## [1.2.4] - 2026-04-06
    31|
    32|### Fixed
    33|
    34|- **PWA**: Service Worker 缓存版本升为 `openclaw-commands-v5`
    35|
    36|### Changed
    37|
    38|- **OpenClaw 版本**: 跟踪至 [v2026.4.5](https://github.com/openclaw/openclaw/releases/tag/v2026.4.5)
    39|- **命令参考**: 新增顶层 `qa` 及子命令；`plugins install` 说明 `--force`；校验脚本默认 tag `v2026.4.5`
    40|
    41|## [1.2.3] - 2026-04-01
    42|
    43|### Fixed
    44|
    45|- **PWA**: Service Worker 缓存版本升为 `openclaw-commands-v4`
    46|
    47|### Changed
    48|
    49|- **OpenClaw 版本**: 跟踪至 [v2026.4.1](https://github.com/openclaw/openclaw/releases/tag/v2026.4.1)
    50|- **命令参考**: 新增顶层 `tasks`（list / audit / maintenance / show / notify / cancel）；`cron` 补充 `--tools` 工具白名单说明；校验脚本默认 tag `v2026.4.1`
    51|
    52|## [1.2.2] - 2026-03-30
    53|
    54|### Fixed
    55|
    56|- **PWA**: Service Worker 缓存版本升为 `openclaw-commands-v3`，避免已安装用户长期命中旧缓存
    57|
    58|### Changed
    59|
    60|- **OpenClaw 版本**: 跟踪至 [v2026.3.28](https://github.com/openclaw/openclaw/releases/tag/v2026.3.28)
    61|- **命令参考**: 新增 `config schema`；`gateway run` 补充 `--cli-backend-logs` / `--claude-cli-logs`（弃用别名）、`--password-file`、`--ws-log`、`--raw-stream` 等；移除已不在官方 CLI 中的顶层 `browser`、`memory` 分类（见 README 说明）
    62|- **校验脚本**: 默认对比官方 tag `v2026.3.28`；支持 `OPENCLAW_LOCAL_REPO` 从本机 openclaw 源码目录读取，便于离线对照
    63|
    64|### Documentation
    65|
    66|- **UPDATING.md**: 补充本地源码目录与校验命令的用法
    67|
    68|## [1.2.1] - 2026-03-26
    69|
    70|### Fixed
    71|
    72|- **GitHub Pages**: 调整 Service Worker 缓存策略，避免发布新版本后因缓存旧 `index.html` 导致白屏
    73|
    74|## [1.2.0] - 2026-03-26
    75|
    76|### Added
    77|
    78|- **版本注记**: 新增「Release Notes」页面（GitHub Releases 拉取 + 离线 fallback），支持按版本切换与中英文显示
    79|- **同步校验**: 新增 `check:cli-sync` / `check:cli-deep-sync` 并接入 CI，防止命令参考与官方差异扩大
    80|- **无障碍**: 键盘焦点 `:focus-visible` 样式、跳过主内容链接
    81|- **性能**: 首屏字体 preload、路由懒加载
    82|- **PWA**: manifest + Service Worker，可安装与离线访问
    83|- **RSS**: `feed.xml` 发布订阅
    84|- **主题**: 亮色/暗色切换（localStorage 记忆）
    85|- **维护**: `UPDATING.md` 随 OpenClaw 更新说明
    86|
    87|### Changed
    88|
    89|- **文案**: 移除未使用的 copyLink/linkCopied；README 11 大类、搜索说明改为「子串匹配」
    90|- **OpenClaw 版本**: 跟踪至 [v2026.3.24](https://github.com/openclaw/openclaw/releases/tag/v2026.3.24)（Latest）
    91|- **系统要求**: 与官方一致 — Node **24**（推荐）或 **22.14+**（见 [openclaw/openclaw](https://github.com/openclaw/openclaw) README）
    92|- **命令参考**: 同步 [v2026.3.24](https://github.com/openclaw/openclaw/releases/tag/v2026.3.24) — `openclaw update` 预检 Node、`--container`/`OPENCLAW_CONTAINER`、skills「needs setup」与 `skills info` 指引；补齐并对齐 `update/backup/sessions/directory/mcp/qr` 等常用子命令与 flags
    93|
    94|## [1.1.0] - 2025-03-11
    95|
    96|### Added
    97|
    98|- **CodeBlock**: Prism.js 语法高亮（bash/shell）
    99|- **Deployment**: 部署指南新增「卸载 OpenClaw」
   100|- **Search**: 搜索结果关键词高亮（命令名、描述）
   101|