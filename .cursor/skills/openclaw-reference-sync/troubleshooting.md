# 故障排查（Agent 逐步修复）

## 1. 网络 / fetch 失败

**现象：** `No official command names parsed`、`Fetch failed`、`Failed to load official source`

**步骤：**

```bash
# 克隆并 checkout 目标 tag
git clone --depth 1 --branch vX.Y.Z https://github.com/openclaw/openclaw /tmp/openclaw
export OPENCLAW_LOCAL_REPO=/tmp/openclaw
npm run check:cli-sync
```

本地目录优先于 raw GitHub；CI 需保证 runner 能访问 GitHub 或预置 `OPENCLAW_LOCAL_REPO`。

---

## 2. 必需 registry 404，可选文件缺失

**现象：** `Failed to load official source ... command-registry.ts`

- 检查 tag 是否存在：`curl -fsSL https://api.github.com/repos/openclaw/openclaw/releases/tags/vX`
- 若仅 `*-core.ts` 失败而必需文件 OK → 正常（可选路径）；若必需文件失败 → tag 错误或上游重构，更新 `scripts/lib/cli-sync-utils.mjs` 中 `OFFICIAL_REGISTRY_PATHS_*`。

---

## 3. Missing commands

**现象：** `Missing commands vs official vX: foo, bar`

1. 在 [reference.md](reference.md) 查命令应放入的 JSON 文件。
2. 复制「CLI 命令 JSON 最小模板」，改 `name` / 描述 / syntax。
3. 从上游 descriptor 取英文描述：
   ```bash
   curl -fsSL "https://raw.githubusercontent.com/openclaw/openclaw/vX/src/cli/program/subcli-descriptors.ts" | rg 'name: "foo"'
   ```
4. 有子命令时拉对应 `*-cli.ts` 或 `register.*.ts`，补 `subcommands` / `options`。
5. 重跑 `npm run check:cli-sync`。

---

## 4. Extra local commands

**现象：** `Extra local commands not in official vX: memory`

1. 从 `src/data/commands/*.json` **删除**该顶层条目（或整分类若已废弃）。
2. 在 README 加一句「vX 起已移除 `openclaw memory`」类说明（若尚未存在）。
3. 重跑 sync check。

---

## 5. deep-sync 失败

**现象：** `[update] subcommands: missing: …` 或 `options: extra: …`

1. 打开 spec 中该命令的 `rel` 源文件（或 `OPENCLAW_LOCAL_REPO` 下同路径）。
2. 更新 `src/data/commands/*.json` 中对应命令的 `subcommands` / `options`。
3. 若官方新增大量 flags 且 spec 过旧，编辑 `scripts/deep-sync-spec.json` 中该命令的 `subcommands` / `flags` 数组。
4. 重跑 `npm run check:cli-deep-sync`。

---

## 6. check:version-consistency 失败

| 失败项 | 修复 |
|--------|------|
| package.json | `node scripts/bump-openclaw-version.mjs vX` |
| README | 同上（自动改跟踪句） |
| releases.bundled | `node scripts/update-bundled-release.mjs --tag vX` |

---

## 7. validate-commands 失败

- `missing descriptionEn` → 补双语字段。
- `duplicate top-level command` → 两个 JSON 有同名顶层，删其一或合并。
- deployment 被当 CLI → 加 `"kind": "guide"`。

---

## 8. Agent 循环伪代码

```
detect → if current: STOP
bump version
loop:
  cli-sync + cli-deep-sync
  if fail: fix JSON/spec → continue
  update bundled + CHANGELOG
  if check fail: fix → continue
  break
if release mode: commit tag push
else: report diff + check OK
```

---

## 9. 可选：本机 CLI 对照

```bash
npm install -g openclaw@latest
openclaw --help
openclaw <cmd> --help
```

与 JSON 人工 diff；不能替代 `check:cli-sync`（以官方源码 registry 为准）。
