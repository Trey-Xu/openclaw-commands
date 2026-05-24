import fs from "node:fs";
import path from "node:path";
import { fail } from "./lib/cli-sync-utils.mjs";
import { fetchLatestRelease, normalizeTag, tagToVersion } from "./lib/upstream.mjs";
import { ROOT } from "./lib/version.mjs";

function usage() {
  process.stderr.write(`Usage:
  node scripts/bump-openclaw-version.mjs <tag>     e.g. v2026.5.21-alpha.1
  node scripts/bump-openclaw-version.mjs --latest  fetch openclaw/openclaw latest release
`);
  process.exitCode = 1;
}

function writeText(relPath, content) {
  fs.writeFileSync(path.join(ROOT, relPath), content);
}

function bumpVersionJs(version) {
  const rel = "src/config/version.js";
  const text = fs.readFileSync(path.join(ROOT, rel), "utf8");
  const next = text.replace(
    /export const OPENCLAW_VERSION = '[^']+'/,
    `export const OPENCLAW_VERSION = '${version}'`,
  );
  if (next === text) fail(`Could not update OPENCLAW_VERSION in ${rel}`);
  writeText(rel, next);
}

function bumpPackageJson(version) {
  for (const rel of ["package.json", "package-lock.json"]) {
    const abs = path.join(ROOT, rel);
    const json = JSON.parse(fs.readFileSync(abs, "utf8"));
    json.version = version;
    if (rel === "package-lock.json" && json.packages?.[""]) {
      json.packages[""].version = version;
    }
    fs.writeFileSync(abs, `${JSON.stringify(json, null, 2)}\n`);
  }
}

function bumpReadmeVersions(version) {
  const tagPhrase = `**v${version}**`;
  const readme = fs.readFileSync(path.join(ROOT, "README.md"), "utf8");
  const readmeZh = fs.readFileSync(path.join(ROOT, "README.zh-CN.md"), "utf8");
  const readmeNext = readme.replace(
    /current reference \*\*v[^*]+\*\*/,
    `current reference ${tagPhrase}`,
  );
  const readmeZhNext = readmeZh.replace(/当前跟踪 \*\*v[^*]+\*\*/, `当前跟踪 ${tagPhrase}`);
  if (readmeNext === readme) fail("Could not update README.md current reference line");
  if (readmeZhNext === readmeZh) fail("Could not update README.zh-CN.md current reference line");
  writeText("README.md", readmeNext);
  writeText("README.zh-CN.md", readmeZhNext);
}

async function main() {
  const arg = process.argv[2];
  if (!arg) {
    usage();
    return;
  }

  let tag;
  if (arg === "--latest") {
    const latest = await fetchLatestRelease();
    tag = latest.tagName;
  } else {
    tag = normalizeTag(arg);
  }

  const version = tagToVersion(tag);
  bumpVersionJs(version);
  bumpPackageJson(version);
  bumpReadmeVersions(version);
  process.stdout.write(`OK: bumped site to OpenClaw ${version} (${tag}).\n`);
  process.stdout.write(`Next: npm run check:cli-sync (fix command JSON) → npm run check\n`);
}

main().catch((err) => {
  fail(String(err?.stack ?? err));
});
