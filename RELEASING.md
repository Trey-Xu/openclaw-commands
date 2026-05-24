# 发布流程 / Release Process

## 版本策略

本站采用与 OpenClaw 一致的 **CalVer**（如 `2026.5.21-alpha.1`）：

- `src/config/version.js` → `OPENCLAW_VERSION`（跟踪上游）
- `package.json` → `version`（与上相同）
- Git tag → `v${version}`（如 `v2026.5.21-alpha.1`）

历史 semver 版本（`1.2.x`）见 `CHANGELOG.md` 旧条目。

## 提交规范 (Commit Convention)

采用 [Conventional Commits](https://www.conventionalcommits.org/) 格式：

```
<type>(<scope>): <description>

[optional body]
```

**常用 type：** `feat` | `fix` | `docs` | `style` | `refactor` | `chore`

## 发布新版本

1. **更新 CHANGELOG.md**  
   - 在 `## [Unreleased]` 下记录改动，或新增 `## [version] - YYYY-MM-DD`

2. **更新版本号**  
   - `src/config/version.js` → `OPENCLAW_VERSION`  
   - `package.json` / `package-lock.json` → 相同 CalVer

3. **质量闸门**  
   ```bash
   npm run check
   ```

4. **提交并打 tag**  
   ```bash
   git add .
   git commit -m "chore(release): v2026.5.21-alpha.1 — sync OpenClaw CLI reference"
   git tag -a v2026.5.21-alpha.1 -m "openclaw-commands v2026.5.21-alpha.1"
   git push origin main
   git push origin v2026.5.21-alpha.1
   ```

5. **自动流程**  
   - 推送 `main` → CI + GitHub Pages 部署（均跑 quality gates）  
   - 推送 tag → `.github/workflows/release.yml` 从 CHANGELOG 创建 GitHub Release
