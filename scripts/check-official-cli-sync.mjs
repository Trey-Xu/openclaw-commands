import fs from "node:fs";
import path from "node:path";

const OFFICIAL_OWNER = process.env.OPENCLAW_OFFICIAL_OWNER ?? "openclaw";
const OFFICIAL_REPO = process.env.OPENCLAW_OFFICIAL_REPO ?? "openclaw";
const OFFICIAL_TAG = process.env.OPENCLAW_OFFICIAL_TAG ?? "v2026.3.24";
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
  const base = `https://raw.githubusercontent.com/${OFFICIAL_OWNER}/${OFFICIAL_REPO}/${OFFICIAL_TAG}`;
  const coreUrl = `${base}/src/cli/program/command-registry.ts`;
  const subUrl = `${base}/src/cli/program/register.subclis.ts`;

  const [coreText, subText] = await Promise.all([fetchText(coreUrl), fetchText(subUrl)]);

  const official = new Set([
    ...parseCommandDescriptorObjects(coreText),
    ...parseCommandDescriptorObjects(subText),
  ]);
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

