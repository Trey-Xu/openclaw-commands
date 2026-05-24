import fs from "node:fs";
import path from "node:path";
import { fail } from "./lib/cli-sync-utils.mjs";
import { loadOpenClawVersion, loadOfficialTag, readPackageVersion, ROOT } from "./lib/version.mjs";

function readText(relPath) {
  return fs.readFileSync(path.join(ROOT, relPath), "utf8");
}

function expectMatch(label, actual, expected) {
  if (actual !== expected) {
    fail(`${label}: expected "${expected}", got "${actual}"`);
  }
}

function expectContains(label, haystack, needle) {
  if (!haystack.includes(needle)) {
    fail(`${label}: expected to contain "${needle}"`);
  }
}

function readBundledNewestVersion() {
  const bundled = JSON.parse(readText("src/data/releases.bundled.json"));
  const first = bundled?.[0]?.releases?.[0];
  return first?.version ?? null;
}

async function main() {
  const openclawVersion = await loadOpenClawVersion();
  const officialTag = await loadOfficialTag();
  const pkgVersion = readPackageVersion();
  const versionJs = readText("src/config/version.js");
  const readme = readText("README.md");
  const readmeZh = readText("README.zh-CN.md");
  const bundledVersion = readBundledNewestVersion();

  expectMatch("package.json version", pkgVersion, openclawVersion);
  expectMatch("official tag", officialTag, `v${openclawVersion}`);
  expectContains("version.js", versionJs, `'${openclawVersion}'`);

  const versionPhrase = `**v${openclawVersion}**`;
  expectContains("README.md current reference", readme, versionPhrase);
  expectContains("README.zh-CN.md current reference", readmeZh, versionPhrase);

  if (bundledVersion !== openclawVersion) {
    fail(
      `releases.bundled.json newest version: expected "${openclawVersion}", got "${bundledVersion ?? "(none)"}"`,
    );
  }

  if (!process.exitCode) {
    process.stdout.write(`OK: version consistency (${openclawVersion}).\n`);
  }
}

main().catch((err) => {
  fail(String(err?.stack ?? err));
});
