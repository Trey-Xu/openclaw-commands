import fs from "node:fs";
import path from "node:path";
import { fail } from "./lib/cli-sync-utils.mjs";
import {
  fetchLatestRelease,
  normalizeTag,
  parseReleaseBullets,
  tagToVersion,
} from "./lib/upstream.mjs";
import { ROOT } from "./lib/version.mjs";

const BUNDLED_PATH = "src/data/releases.bundled.json";

function readBundled() {
  return JSON.parse(fs.readFileSync(path.join(ROOT, BUNDLED_PATH), "utf8"));
}

function writeBundled(data) {
  fs.writeFileSync(path.join(ROOT, BUNDLED_PATH), `${JSON.stringify(data, null, 2)}\n`);
}

function parseArgs(argv) {
  const opts = { tag: null, published: null, zh: null, en: null, latest: false };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--latest") opts.latest = true;
    else if (a === "--tag" && argv[i + 1]) opts.tag = normalizeTag(argv[++i]);
    else if (a === "--published" && argv[i + 1]) opts.published = argv[++i];
    else if (a === "--zh" && argv[i + 1]) opts.zh = argv[++i];
    else if (a === "--en" && argv[i + 1]) opts.en = argv[++i];
    else if (a.startsWith("v")) opts.tag = normalizeTag(a);
  }
  return opts;
}

function bulletsToItems(bullets, zhFallback, enFallback) {
  if (bullets.length === 0) {
    return [
      {
        zh: zhFallback ?? "同步官方 OpenClaw CLI 新版本。",
        en: enFallback ?? "Sync with a new official OpenClaw CLI release.",
      },
    ];
  }
  return bullets.map((b) => ({
    zh: zhFallback ?? b.en,
    en: b.en,
  }));
}

async function main() {
  const opts = parseArgs(process.argv);
  let tag = opts.tag;
  let publishedAt = opts.published ?? new Date().toISOString().slice(0, 10);
  let url;
  let bullets = [];

  if (opts.latest || !tag) {
    const latest = await fetchLatestRelease();
    tag = latest.tagName;
    publishedAt = latest.publishedAt || publishedAt;
    url = latest.url;
    bullets = parseReleaseBullets(latest.body);
  } else {
    const version = tagToVersion(tag);
    url = `https://github.com/openclaw/openclaw/releases/tag/${tag}`;
    if (opts.en) bullets = [{ en: opts.en }];
  }

  const version = tagToVersion(tag);
  const bundled = readBundled();
  const releases = bundled[0]?.releases ?? [];
  if (releases.some((r) => r.version === version)) {
    process.stdout.write(`Skip: ${version} already in ${BUNDLED_PATH}.\n`);
    return;
  }

  const entry = {
    tagName: tag,
    version,
    publishedAt,
    url,
    sections: [
      {
        title: "Changes",
        items: bulletsToItems(bullets, opts.zh, opts.en),
      },
    ],
  };

  bundled[0].releases = [entry, ...releases];
  writeBundled(bundled);
  process.stdout.write(`OK: prepended ${tag} to ${BUNDLED_PATH}.\n`);
}

main().catch((err) => {
  fail(String(err?.stack ?? err));
});
