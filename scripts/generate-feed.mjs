import fs from "node:fs";
import path from "node:path";
import { ROOT } from "./lib/version.mjs";

const SITE = "https://trey-xu.github.io/openclaw-commands/";
const REPO = "https://github.com/Trey-Xu/openclaw-commands";

function parseChangelogEntries(text) {
  const entries = [];
  const re = /^## \[([^\]]+)\] - (\d{4}-\d{2}-\d{2})\s*$/gm;
  const matches = [...text.matchAll(re)];
  for (let i = 0; i < matches.length; i++) {
    const [, version, date] = matches[i];
    if (version === "Unreleased") continue;
    const start = matches[i].index + matches[i][0].length;
    const end = matches[i + 1]?.index ?? text.length;
    const body = text.slice(start, end).trim();
    const summary = body
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.startsWith("- "))
      .slice(0, 5)
      .map((l) => l.replace(/^-\s*/, ""))
      .join("; ");
    entries.push({ version, date, summary: summary || body.split("\n")[0]?.trim() || version });
  }
  return entries.slice(0, 15);
}

function toRfc822(dateStr) {
  return new Date(`${dateStr}T12:00:00Z`).toUTCString();
}

function escapeXml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function main() {
  const changelog = fs.readFileSync(path.join(ROOT, "CHANGELOG.md"), "utf8");
  const entries = parseChangelogEntries(changelog);
  const items = entries
    .map(
      (e) => `    <item>
      <title>${escapeXml(e.version)}</title>
      <link>${REPO}/releases/tag/v${escapeXml(e.version)}</link>
      <description>${escapeXml(e.summary)}</description>
      <pubDate>${toRfc822(e.date)}</pubDate>
    </item>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>OpenClaw Command Reference - Changelog</title>
    <link>${SITE}</link>
    <description>OpenClaw CLI 命令参考站更新与发布说明</description>
    <atom:link href="${SITE}feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

  const out = path.join(ROOT, "public/feed.xml");
  fs.writeFileSync(out, xml);
  process.stdout.write(`OK: wrote ${entries.length} items to public/feed.xml\n`);
}

main();
