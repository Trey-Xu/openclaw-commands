import fs from "node:fs";
import path from "node:path";

const OFFICIAL_OWNER = process.env.OPENCLAW_OFFICIAL_OWNER ?? "openclaw";
const OFFICIAL_REPO = process.env.OPENCLAW_OFFICIAL_REPO ?? "openclaw";
const OFFICIAL_TAG = process.env.OPENCLAW_OFFICIAL_TAG ?? "v2026.4.5";
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
    headers: { "user-agent": "openclaw-commands-cli-deep-sync-check" },
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

function extractOptionFlags(tsText) {
  // `.option("--foo <bar>", "...")` -> "--foo"
  const out = new Set();
  const re = /\.option\(\s*"([^"]+)"/g;
  for (;;) {
    const m = re.exec(tsText);
    if (!m) break;
    const raw = m[1].trim();
    if (!raw) continue;
    const first = raw.split(/[ ,]/)[0];
    if (first.startsWith("-")) out.add(first);
  }
  return out;
}

function buildCommandVarGraph(tsText) {
  // Heuristic for commander chains:
  // const peers = directory.command("peers")
  // const directory = program.command("directory")
  const varToName = new Map(); // var -> command name
  const varToParent = new Map(); // var -> parent var

  const declRe =
    /\bconst\s+([A-Za-z_$][\w$]*)\s*=\s*([A-Za-z_$][\w$]*)\s*[\r\n\s]*\.\s*command\(\s*"([^"]+)"\s*\)/g;
  for (;;) {
    const m = declRe.exec(tsText);
    if (!m) break;
    const [, childVar, parentVar, name] = m;
    varToName.set(childVar, name);
    varToParent.set(childVar, parentVar);
  }

  return { varToName, varToParent };
}

function resolveVarCommandPath(varName, graph) {
  const parts = [];
  let cur = varName;
  const seen = new Set();
  while (cur && !seen.has(cur)) {
    seen.add(cur);
    const name = graph.varToName.get(cur);
    if (name) parts.push(name);
    cur = graph.varToParent.get(cur);
  }
  return parts.reverse().join(" ").trim();
}

function extractCommandPaths(tsText) {
  // Extract 1-level and 2-level command paths by combining variable chains when present.
  const graph = buildCommandVarGraph(tsText);
  const out = new Set();

  // Direct: `program.command("update")`
  const rootRe = /\bprogram\s*[\r\n\s]*\.\s*command\(\s*"([^"]+)"\s*\)/g;
  for (;;) {
    const m = rootRe.exec(tsText);
    if (!m) break;
    out.add(m[1]);
  }

  // Nested: `<var>.command("x")` — resolve `<var>` to a path if we can.
  const nestedRe = /\b([A-Za-z_$][\w$]*)\s*[\r\n\s]*\.\s*command\(\s*"([^"]+)"\s*\)/g;
  for (;;) {
    const m = nestedRe.exec(tsText);
    if (!m) break;
    const [, parentVar, childName] = m;
    const parentPath = resolveVarCommandPath(parentVar, graph);
    if (parentPath) out.add(`${parentPath} ${childName}`.trim());
  }

  return out;
}

function readLocalCommandsIndex() {
  const abs = path.resolve(COMMANDS_DIR);
  const files = fs.readdirSync(abs).filter((f) => f.endsWith(".json"));

  /** @type {Map<string, any>} */
  const byName = new Map();

  for (const file of files) {
    const json = JSON.parse(fs.readFileSync(path.join(abs, file), "utf8"));
    for (const cmd of json.commands ?? []) {
      if (!cmd?.name) continue;
      const top = normalizeTopLevelName(cmd.name);
      if (file === "deployment.json" && isDeploymentSectionName(top)) continue;
      byName.set(top, cmd);
    }
  }

  return byName;
}

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
  // Hard requirements (we still load official files, but we validate against these
  // to avoid over/under-attributing flags in multi-command registrars).
  const REQUIRED = {
    update: {
      subcommands: new Set(["wizard", "status"]),
      flags: new Set([
        "--json",
        "--no-restart",
        "--dry-run",
        "--channel",
        "--tag",
        "--timeout",
        "--yes",
      ]),
    },
    qr: {
      subcommands: new Set([]),
      flags: new Set([
        "--remote",
        "--url",
        "--public-url",
        "--token",
        "--password",
        "--setup-code-only",
        "--no-ascii",
        "--json",
      ]),
    },
    mcp: {
      subcommands: new Set(["list", "show [name]", "set <name> <json>", "unset <name>"]),
      flags: new Set(["--json"]),
    },
    directory: {
      subcommands: new Set(["self", "peers list", "groups list", "groups members"]),
      flags: new Set(["--channel", "--account", "--json", "--query", "--limit", "--group-id"]),
    },
    backup: {
      subcommands: new Set(["create", "verify <archive>"]),
      flags: new Set([
        "--output",
        "--json",
        "--dry-run",
        "--verify",
        "--only-config",
        "--no-include-workspace",
      ]),
    },
    sessions: {
      subcommands: new Set(["cleanup"]),
      flags: new Set(["--store", "--agent", "--all-agents", "--active", "--json", "--verbose"]),
    },
  };

  const targets = [
    // Core
    { name: "backup", rel: "src/cli/program/register.backup.ts" },
    { name: "sessions", rel: "src/cli/program/register.status-health-sessions.ts" },
    // SubCLIs
    { name: "update", rel: "src/cli/update-cli.ts" },
    { name: "directory", rel: "src/cli/directory-cli.ts" },
    { name: "mcp", rel: "src/cli/mcp-cli.ts" },
    { name: "qr", rel: "src/cli/qr-cli.ts" },
  ];

  const local = readLocalCommandsIndex();

  for (const t of targets) {
    const localCmd = local.get(t.name);
    if (!localCmd) {
      fail(`Local missing command entry: ${t.name}`);
      continue;
    }

    const text = await loadOfficialText(t.rel);
    // Sanity: ensure official file actually mentions the command name at least once.
    const paths = extractCommandPaths(text);
    if (![...paths].some((p) => p === t.name || p.startsWith(`${t.name} `))) {
      fail(`[${t.name}] official source parse: did not find command in ${t.rel}`);
    }

    const localSub = collectLocalSubcommands(localCmd);
    const localFlags = collectLocalOptionFlags(localCmd);

    const required = REQUIRED[t.name];
    if (!required) {
      fail(`Internal error: missing REQUIRED spec for ${t.name}`);
      continue;
    }

    diffSets(`[${t.name}] subcommands`, required.subcommands, localSub);

    const missingFlags = [...required.flags].filter((f) => !localFlags.has(f)).sort();
    if (missingFlags.length) {
      fail(`[${t.name}] options: missing flags: ${missingFlags.join(", ")}`);
    }
  }

  if (!process.exitCode) {
    process.stdout.write(`OK: deep CLI sync checks passed (${OFFICIAL_TAG}).\n`);
  }
}

main().catch((err) => {
  fail(String(err?.stack ?? err));
});

