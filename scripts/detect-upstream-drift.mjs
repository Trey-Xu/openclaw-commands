import { loadOpenClawVersion } from "./lib/version.mjs";
import { fetchLatestRelease, normalizeTag } from "./lib/upstream.mjs";

function printJson(payload) {
  process.stdout.write(`${JSON.stringify(payload, null, 2)}\n`);
}

async function main() {
  const jsonMode = process.argv.includes("--json");
  const localVersion = await loadOpenClawVersion();
  const localTag = normalizeTag(localVersion);

  let latest;
  try {
    latest = await fetchLatestRelease();
  } catch (err) {
    const payload = {
      status: "error",
      localTag,
      localVersion,
      error: String(err?.message ?? err),
    };
    if (jsonMode) printJson(payload);
    else process.stderr.write(`${payload.error}\n`);
    process.exitCode = 2;
    return;
  }

  const payload = {
    status: latest.tagName === localTag ? "current" : "drift",
    localTag,
    localVersion,
    latestTag: latest.tagName,
    latestVersion: latest.version,
    latestUrl: latest.url,
    latestPublishedAt: latest.publishedAt,
    agentPrompt:
      latest.tagName === localTag
        ? null
        : `Sync openclaw-commands to OpenClaw ${latest.tagName}. Follow .cursor/skills/openclaw-reference-sync/SKILL.md in sync-only mode first; run npm run check; use release mode only if asked to publish.`,
  };

  if (jsonMode) {
    printJson(payload);
  } else if (payload.status === "current") {
    process.stdout.write(`OK: site tracks latest OpenClaw release (${localTag}).\n`);
  } else {
    process.stdout.write(
      `DRIFT: site ${localTag} != latest ${latest.tagName}\nRun: node scripts/bump-openclaw-version.mjs ${latest.tagName}\n`,
    );
  }

  process.exitCode = payload.status === "current" ? 0 : payload.status === "drift" ? 1 : 2;
}

main();
