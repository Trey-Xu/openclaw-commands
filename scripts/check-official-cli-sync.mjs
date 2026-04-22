import fs from "node:fs";
import path from "node:path";

const OFFICIAL_OWNER = process.env.OPENCLAW_OFFICIAL_OWNER ?? "openclaw";
const OFFICIAL_REPO = process.env.OPENCLAW_OFFICIAL_REPO ?? "openclaw";
const OFFICIAL_TAG = process.env.OPENCLAW_OFFICIAL_TAG ?? "v2026.4.21";
const LOCAL_REPO = process.env.OPENCLAW_LOCAL_REPO?.trim();
const COMMANDS_DIR = process.env.OPENCLAW_COMMANDS_DIR ?? "src/data/commands";

function fail(message) {
  process.stderr.write(`${message}\n`);
  process.exitCode = 1;
}

function normalizeTopLevelName(name) {
  return String(name).trim().split(/\s+/)[0];
}

function isDeploymentSectionName(name) {
  // `deployment.json` uses section-like "name" entries, not real CLI commands.
  return (
    name.includes("安装") ||
    name.includes("卸载") ||
    name.includes("系统要求") ||
    name.includes("快速启动") ||
    name.includes("配置") ||
    name.includes("接入") ||
    name.includes("安全") ||
    name.includes("Gateway") ||
    name.includes("远程") ||
    name.includes("容器内运行")
  );
}

async function fetchText(url) {
  const res = await fetch(url, {
    headers: { "user-agent": "openclaw-commands-cli-sync-check" },
  });
  if (!res.ok) {
    throw new Error(`Fetch failed ${res.status} ${res.statusText}: ${url}`);
  }
  return await res.text();
}

function readOfficialSource(relPath) {
  if (!LOCAL_REPO) return null;
  const abs = path.join(LOCAL_REPO, relPath);
  return fs.readFileSync(abs, "utf8");
}

async function loadOfficialText(relPath) {
  const local = readOfficialSource(relPath);
  if (local != null) return local;
  const url = `https://raw.githubusercontent.com/${OFFICIAL_OWNER}/${OFFICIAL_REPO}/${OFFICIAL_TAG}/${relPath}`;
  return fetchText(url);
}

function parseDescriptorNames(tsText) {
  // Extract `name: "foo"` inside exported descriptor arrays.
  const out = [];
  const re = /\bname:\s*"([^"]+)"\s*,/g;
  for (;;) {
    const m = re.exec(tsText);
    if (!m) break;
    out.push(m[1]);
  }
  return out;
}

function parseCommandDescriptorObjects(tsText) {
  // Prefer parsing the actual command registries (more authoritative than descriptor lists).
  // Match objects like: { name: "setup", description: "...", hasSubcommands: false }
  const out = [];
  const re = /\{\s*name:\s*"([^"]+)"\s*,\s*description:\s*"[^"]*"\s*,/g;
  for (;;) {
    const m = re.exec(tsText);
    if (!m) break;
    out.push(m[1]);
  }
  return out;
}

function parseLooseBraceNames(tsText) {
  // Newer layouts use multiline `description:`; match `{ name: "foo",` anywhere in descriptor catalogs.
  const out = [];
  const re = /\{\s*name:\s*"([^"]+)"\s*,/g;
  for (;;) {
    const m = re.exec(tsText);
    if (!m) break;
    out.push(m[1]);
  }
  return out;
}

function parseCommandNamesArrays(tsText) {
  // e.g. commandNames: ["setup"], or commandNames: ["agent", "agents"],
  const out = [];
  const re = /commandNames:\s*\[([\s\S]*?)\]/g;
  for (;;) {
    const m = re.exec(tsText);
    if (!m) break;
    const inner = m[1];
    const qre = /"([^"]+)"/g;
    for (;;) {
      const q = qre.exec(inner);
      if (!q) break;
      out.push(q[1]);
    }
  }
  return out;
}

function mergeOfficialNames(...chunks) {
  const official = new Set();
  for (const text of chunks) {
    if (!text) continue;
    for (const n of parseCommandDescriptorObjects(text)) official.add(n);
    for (const n of parseLooseBraceNames(text)) official.add(n);
    for (const n of parseCommandNamesArrays(text)) official.add(n);
  }
  return official;
}

async function loadOptionalOfficialText(relPath) {
  try {
    return await loadOfficialText(relPath);
  } catch {
    return "";
  }
}

function readLocalTopLevelCommands() {
  const abs = path.resolve(COMMANDS_DIR);
  const files = fs.readdirSync(abs).filter((f) => f.endsWith(".json"));
  const names = new Set();

  for (const file of files) {
    const json = JSON.parse(fs.readFileSync(path.join(abs, file), "utf8"));
    for (const cmd of json.commands ?? []) {
      if (!cmd?.name) continue;
      const top = normalizeTopLevelName(cmd.name);
      if (file === "deployment.json" && isDeploymentSectionName(top)) continue;
      names.add(top);
    }
  }

  return names;
}

async function main() {
  const paths = [
    "src/cli/program/command-registry.ts",
    "src/cli/program/register.subclis.ts",
    "src/cli/program/core-command-descriptors.ts",
    "src/cli/program/subcli-descriptors.ts",
    "src/cli/program/command-registry-core.ts",
    "src/cli/program/register.subclis-core.ts",
  ];
  const chunks = await Promise.all(paths.map((p) => loadOptionalOfficialText(p)));
  const official = mergeOfficialNames(...chunks);
  if (official.size === 0) {
    fail(
      `No official command names parsed (${OFFICIAL_TAG}). Check network or set OPENCLAW_LOCAL_REPO to an openclaw clone at this tag.`,
    );
    return;
  }
  const local = readLocalTopLevelCommands();

  const missing = [...official].filter((x) => !local.has(x)).sort();
  const extra = [...local].filter((x) => !official.has(x)).sort();

  if (missing.length === 0 && extra.length === 0) {
    process.stdout.write(
      `OK: local commands match official (${OFFICIAL_TAG}). count=${official.size}\n`,
    );
    return;
  }

  if (missing.length) {
    fail(`Missing commands vs official ${OFFICIAL_TAG}: ${missing.join(", ")}`);
  }
  if (extra.length) {
    fail(`Extra local commands not in official ${OFFICIAL_TAG}: ${extra.join(", ")}`);
  }
}

main().catch((err) => {
  fail(String(err?.stack ?? err));
});

