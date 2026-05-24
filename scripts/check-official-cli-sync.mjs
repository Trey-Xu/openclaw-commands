import {
  fail,
  loadOfficialRegistryTexts,
  readLocalTopLevelCommands,
  resolveOfficialTag,
} from "./lib/cli-sync-utils.mjs";
import { mergeOfficialNames } from "./lib/cli-parsers.mjs";

async function main() {
  const officialTag = await resolveOfficialTag();
  const chunks = await loadOfficialRegistryTexts(officialTag);
  const official = mergeOfficialNames(...chunks);
  if (official.size === 0) {
    fail(
      `No official command names parsed (${officialTag}). Check network or set OPENCLAW_LOCAL_REPO to an openclaw clone at this tag.`,
    );
    return;
  }
  const local = readLocalTopLevelCommands();

  const missing = [...official].filter((x) => !local.has(x)).sort();
  const extra = [...local].filter((x) => !official.has(x)).sort();

  if (missing.length === 0 && extra.length === 0) {
    process.stdout.write(
      `OK: local commands match official (${officialTag}). count=${official.size}\n`,
    );
    return;
  }

  if (missing.length) {
    fail(`Missing commands vs official ${officialTag}: ${missing.join(", ")}`);
  }
  if (extra.length) {
    fail(`Extra local commands not in official ${officialTag}: ${extra.join(", ")}`);
  }
}

main().catch((err) => {
  fail(String(err?.stack ?? err));
});
