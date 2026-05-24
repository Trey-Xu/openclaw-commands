import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = path.resolve(import.meta.dirname, "../..");
const VERSION_JS = path.join(ROOT, "src/config/version.js");

/** @returns {Promise<string>} OpenClaw CalVer without `v` prefix */
export async function loadOpenClawVersion() {
  const mod = await import(pathToFileURL(VERSION_JS).href);
  const version = mod.OPENCLAW_VERSION;
  if (!version || typeof version !== "string") {
    throw new Error(`OPENCLAW_VERSION missing in ${VERSION_JS}`);
  }
  return version;
}

/** @returns {Promise<string>} Official git tag, e.g. `v2026.5.21-alpha.1` */
export async function loadOfficialTag() {
  const env = process.env.OPENCLAW_OFFICIAL_TAG?.trim();
  if (env) return env.startsWith("v") ? env : `v${env}`;
  const version = await loadOpenClawVersion();
  return `v${version}`;
}

export function readPackageVersion() {
  const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, "package.json"), "utf8"));
  return pkg.version;
}

export { ROOT };
