# 发布流程 / Release Process

## 提交规范 (Commit Convention)

采用 [Conventional Commits](https://www.conventionalcommits.org/) 格式：

```
<type>(<scope>): <description>

[optional body]
```

**常用 type：**

| Type | 说明 |
|------|------|
| `feat` | 新功能 |
| `fix` | 修复 |
| `docs` | 文档 |
| `style` | 格式（不影响逻辑） |
| `refactor` | 重构 |
| `chore` | 构建/工具等 |

**示例：**
```
feat(search): add Ctrl+F shortcut
fix(footer): right-align footer links
docs: update CHANGELOG for v1.0.0
```

## 发布新版本

1. **更新 CHANGELOG.md**
   - 在 `## [Unreleased]` 下记录本次改动（如有）
   - 或新增 `## [x.y.z] - YYYY-MM-DD` 段

2. **更新版本号**
   - `package.json` 中的 `version`
   - 若涉及 OpenClaw 版本：`src/config/version.js` 中的 `OPENCLAW_VERSION`

3. **提交并打 tag**
   ```bash
   git add .
   git commit -m "chore(release): v1.0.0"
   git tag v1.0.0
   git push origin main
   git push origin v1.0.0
   ```

4. **自动创建 Release**
   - 推送 tag 后，`.github/workflows/release.yml` 会自动创建 GitHub Release
   - Release 说明从 `CHANGELOG.md` 中对应版本段落提取
