import fs from "node:fs";
import path from "node:path";
import { loadOfficialTag, ROOT } from "./version.mjs";

export const OFFICIAL_OWNER = process.env.OPENCLAW_OFFICIAL_OWNER ?? "openclaw";
export const OFFICIAL_REPO = process.env.OPENCLAW_OFFICIAL_REPO ?? "openclaw";
export const LOCAL_REPO = process.env.OPENCLAW_LOCAL_REPO?.trim();
export const COMMANDS_DIR = process.env.OPENCLAW_COMMANDS_DIR ?? "src/data/commands";

export const OFFICIAL_REGISTRY_PATHS_REQUIRED = [
  "src/cli/program/command-registry.ts",
  "src/cli/program/register.subclis.ts",
];

export const OFFICIAL_REGISTRY_PATHS_OPTIONAL = [
  "src/cli/program/core-command-descriptors.ts",
  "src/cli/program/subcli-descriptors.ts",
  "src/cli/program/command-registry-core.ts",
  "src/cli/program/register.subclis-core.ts",
];

export const OFFICIAL_REGISTRY_PATHS = [
  ...OFFICIAL_REGISTRY_PATHS_REQUIRED,
  ...OFFICIAL_REGISTRY_PATHS_OPTIONAL,
];

export function fail(message) {
  process.stderr.write(`${message}\n`);
  process.exitCode = 1;
}

export function normalizeTopLevelName(name) {
  return String(name).trim().split(/\s+/)[0];
}

/** @deprecated Prefer explicit `kind: "guide"` on deployment entries */
export function isDeploymentSectionName(name) {
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

export function isCliCommandEntry(cmd, file) {
  if (cmd?.kind === "guide") return false;
  if (cmd?.kind === "command") return true;
  if (file === "deployment.json" && isDeploymentSectionName(normalizeTopLevelName(cmd?.name ?? ""))) {
    return false;
  }
  return Boolean(cmd?.name);
}

export async function fetchText(url, userAgent = "openclaw-commands-cli-sync-check") {
  const res = await fetch(url, {
    headers: { "user-agent": userAgent },
    signal: AbortSignal.timeout(60_000),
  });
  if (!res.ok) {
    throw new Error(`Fetch failed ${res.status} ${res.statusText}: ${url}`);
  }
  return await res.text();
}

export function readOfficialSource(relPath) {
  if (!LOCAL_REPO) return null;
  const abs = path.join(LOCAL_REPO, relPath);
  if (!fs.existsSync(abs)) return null;
  return fs.readFileSync(abs, "utf8");
}

export async function loadOfficialText(relPath, officialTag) {
  const local = readOfficialSource(relPath);
  if (local != null) return local;
  const url = `https://raw.githubusercontent.com/${OFFICIAL_OWNER}/${OFFICIAL_REPO}/${officialTag}/${relPath}`;
  return fetchText(url);
}

export async function loadRequiredOfficialText(relPath, officialTag) {
  try {
    const text = await loadOfficialText(relPath, officialTag);
    if (!text?.trim()) {
      throw new Error(`empty content for ${relPath}`);
    }
    return text;
  } catch (err) {
    throw new Error(`Failed to load official source ${relPath} (${officialTag}): ${err.message}`);
  }
}

export async function loadOptionalOfficialText(relPath, officialTag) {
  try {
    return await loadOfficialText(relPath, officialTag);
  } catch {
    return "";
  }
}

export async function loadOfficialRegistryTexts(officialTag) {
  const required = await Promise.all(
    OFFICIAL_REGISTRY_PATHS_REQUIRED.map((p) => loadRequiredOfficialText(p, officialTag)),
  );
  const optional = await Promise.all(
    OFFICIAL_REGISTRY_PATHS_OPTIONAL.map((p) => loadOptionalOfficialText(p, officialTag)),
  );
  return [...required, ...optional];
}

export function readLocalTopLevelCommands() {
  const abs = path.resolve(COMMANDS_DIR);
  const files = fs.readdirSync(abs).filter((f) => f.endsWith(".json"));
  const names = new Set();

  for (const file of files) {
    const json = JSON.parse(fs.readFileSync(path.join(abs, file), "utf8"));
    for (const cmd of json.commands ?? []) {
      if (!isCliCommandEntry(cmd, file)) continue;
      names.add(normalizeTopLevelName(cmd.name));
    }
  }

  return names;
}

export function readLocalCommandsIndex() {
  const abs = path.resolve(COMMANDS_DIR);
  const files = fs.readdirSync(abs).filter((f) => f.endsWith(".json"));
  /** @type {Map<string, object>} */
  const byName = new Map();

  for (const file of files) {
    const json = JSON.parse(fs.readFileSync(path.join(abs, file), "utf8"));
    for (const cmd of json.commands ?? []) {
      if (!isCliCommandEntry(cmd, file)) continue;
      byName.set(normalizeTopLevelName(cmd.name), cmd);
    }
  }

  return byName;
}

export async function resolveOfficialTag() {
  return loadOfficialTag();
}

export function commandsDirAbs() {
  return path.resolve(ROOT, COMMANDS_DIR);
}
