import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  extractCommandPaths,
  mergeOfficialNames,
  parseCommandNamesArrays,
  parseLooseBraceNames,
} from "../scripts/lib/cli-parsers.mjs";
import { isCliCommandEntry, normalizeTopLevelName } from "../scripts/lib/cli-sync-utils.mjs";

describe("parseCommandNamesArrays", () => {
  it("extracts names from commandNames arrays", () => {
    const ts = `export const x = { commandNames: ["setup", "agent"], };`;
    assert.deepEqual(parseCommandNamesArrays(ts), ["setup", "agent"]);
  });
});

describe("parseLooseBraceNames", () => {
  it("extracts name from multiline descriptors", () => {
    const ts = `{ name: "infer",\n  description: "...",\n},`;
    assert.deepEqual(parseLooseBraceNames(ts), ["infer"]);
  });
});

describe("mergeOfficialNames", () => {
  it("deduplicates across chunks", () => {
    const a = `{ name: "setup", description: "x", },`;
    const b = `commandNames: ["setup", "doctor"],`;
    const merged = mergeOfficialNames(a, b);
    assert.equal(merged.size, 2);
    assert.ok(merged.has("setup"));
    assert.ok(merged.has("doctor"));
  });
});

describe("extractCommandPaths", () => {
  it("resolves nested commander chains", () => {
    const ts = `
      const directory = program.command("directory");
      const peers = directory.command("peers");
      peers.command("list");
    `;
    const paths = extractCommandPaths(ts);
    assert.ok([...paths].includes("directory"));
    assert.ok([...paths].some((p) => p.includes("peers")));
  });
});

describe("isCliCommandEntry", () => {
  it("skips deployment guides with kind guide", () => {
    assert.equal(
      isCliCommandEntry({ name: "安装 OpenClaw", kind: "guide" }, "deployment.json"),
      false,
    );
  });

  it("includes real CLI commands", () => {
    assert.equal(isCliCommandEntry({ name: "status" }, "system.json"), true);
  });

  it("normalizes top-level token", () => {
    assert.equal(normalizeTopLevelName("show [name]"), "show");
  });
});
