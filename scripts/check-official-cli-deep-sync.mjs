import fs from "node:fs";
import path from "node:path";
import {
  fail,
  loadRequiredOfficialText,
  readLocalCommandsIndex,
  resolveOfficialTag,
} from "./lib/cli-sync-utils.mjs";
import { extractCommandPaths } from "./lib/cli-parsers.mjs";

const SPEC_PATH = path.resolve(import.meta.dirname, "deep-sync-spec.json");

function normalizeLocalSubcommandName(name) {
  return String(name).trim().replace(/\s+/g, " ");
}

function collectLocalSubcommands(cmd) {
  const out = new Set();
  for (const sc of cmd?.subcommands ?? []) {
    if (!sc?.name) continue;
    out.add(normalizeLocalSubcommandName(sc.name));
  }
  return out;
}

function collectLocalOptionFlags(cmd) {
  const out = new Set();
  for (const opt of cmd?.options ?? []) {
    if (!opt?.flag) continue;
    const first = String(opt.flag).trim().split(/[ ,]/)[0];
    if (first.startsWith("-")) out.add(first);
  }
  return out;
}

function diffSets(label, expected, actual) {
  const missing = [...expected].filter((x) => !actual.has(x)).sort();
  const extra = [...actual].filter((x) => !expected.has(x)).sort();
  if (missing.length) fail(`${label}: missing: ${missing.join(", ")}`);
  if (extra.length) fail(`${label}: extra: ${extra.join(", ")}`);
}

async function main() {
  const officialTag = await resolveOfficialTag();
  const spec = JSON.parse(fs.readFileSync(SPEC_PATH, "utf8"));
  const local = readLocalCommandsIndex();

  for (const [name, entry] of Object.entries(spec)) {
    const localCmd = local.get(name);
    if (!localCmd) {
      fail(`Local missing command entry: ${name}`);
      continue;
    }

    const text = await loadRequiredOfficialText(entry.rel, officialTag);
    const paths = extractCommandPaths(text);
    if (![...paths].some((p) => p === name || p.startsWith(`${name} `))) {
      fail(`[${name}] official source parse: did not find command in ${entry.rel}`);
    }

    const localSub = collectLocalSubcommands(localCmd);
    const localFlags = collectLocalOptionFlags(localCmd);
    const requiredSub = new Set(entry.subcommands ?? []);
    const requiredFlags = new Set(entry.flags ?? []);

    diffSets(`[${name}] subcommands`, requiredSub, localSub);
    diffSets(`[${name}] options`, requiredFlags, localFlags);
  }

  if (!process.exitCode) {
    process.stdout.write(`OK: deep CLI sync checks passed (${officialTag}).\n`);
  }
}

main().catch((err) => {
  fail(String(err?.stack ?? err));
});
