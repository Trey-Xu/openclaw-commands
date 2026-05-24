const DEFAULT_OWNER = process.env.OPENCLAW_OFFICIAL_OWNER ?? "openclaw";
const DEFAULT_REPO = process.env.OPENCLAW_OFFICIAL_REPO ?? "openclaw";

export function normalizeTag(tag) {
  const t = String(tag).trim();
  return t.startsWith("v") ? t : `v${t}`;
}

export function tagToVersion(tag) {
  return normalizeTag(tag).slice(1);
}

export async function fetchLatestRelease(
  owner = DEFAULT_OWNER,
  repo = DEFAULT_REPO,
) {
  const url = `https://api.github.com/repos/${owner}/${repo}/releases/latest`;
  const res = await fetch(url, {
    headers: {
      Accept: "application/vnd.github+json",
      "user-agent": "openclaw-commands-upstream",
    },
    signal: AbortSignal.timeout(60_000),
  });
  if (!res.ok) {
    throw new Error(`GitHub API ${res.status} for ${url}`);
  }
  const data = await res.json();
  const tagName = normalizeTag(data.tag_name ?? "");
  return {
    tagName,
    version: tagToVersion(tagName),
    publishedAt: (data.published_at ?? "").slice(0, 10),
    url: data.html_url ?? `https://github.com/${owner}/${repo}/releases/tag/${tagName}`,
    body: String(data.body ?? "").trim(),
  };
}

/** @returns {{ en: string }[]} */
export function parseReleaseBullets(body, limit = 8) {
  const items = [];
  for (const line of body.split("\n")) {
    const m = line.match(/^\s*[-*]\s+(.+)$/);
    if (!m) continue;
    const text = m[1].replace(/\(#\d+\)/g, "").trim();
    if (text) items.push({ en: text });
    if (items.length >= limit) break;
  }
  return items;
}
