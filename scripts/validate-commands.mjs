import fs from "node:fs";
import path from "node:path";
import { commandsDirAbs, fail, isCliCommandEntry, normalizeTopLevelName } from "./lib/cli-sync-utils.mjs";

function validateCommand(cmd, file, index, errors) {
  const prefix = `${file} commands[${index}] (${cmd?.name ?? "?"})`;

  if (cmd.kind === "guide") {
    for (const field of ["name", "description"]) {
      if (!cmd[field]?.trim()) errors.push(`${prefix}: guide missing ${field}`);
    }
    return;
  }

  for (const field of ["name", "description", "descriptionEn", "syntax"]) {
    if (!cmd[field]?.trim()) errors.push(`${prefix}: missing ${field}`);
  }

  if (!Array.isArray(cmd.options)) errors.push(`${prefix}: options must be an array`);
  if (!Array.isArray(cmd.examples)) errors.push(`${prefix}: examples must be an array`);
  if (!Array.isArray(cmd.subcommands)) errors.push(`${prefix}: subcommands must be an array`);

  for (const [i, opt] of (cmd.options ?? []).entries()) {
    if (!opt?.flag?.trim()) errors.push(`${prefix} options[${i}]: missing flag`);
    if (!opt?.description?.trim()) errors.push(`${prefix} options[${i}]: missing description`);
  }

  for (const [i, sc] of (cmd.subcommands ?? []).entries()) {
    if (!sc?.name?.trim()) errors.push(`${prefix} subcommands[${i}]: missing name`);
    if (!sc?.description?.trim()) errors.push(`${prefix} subcommands[${i}]: missing description`);
  }
}

function main() {
  const abs = commandsDirAbs();
  const files = fs.readdirSync(abs).filter((f) => f.endsWith(".json"));
  const errors = [];
  const topLevelNames = new Map();

  for (const file of files) {
    const jsonPath = path.join(abs, file);
    let json;
    try {
      json = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
    } catch (err) {
      errors.push(`${file}: invalid JSON — ${err.message}`);
      continue;
    }

    for (const field of ["id", "name", "nameEn"]) {
      if (!json[field]?.trim()) errors.push(`${file}: category missing ${field}`);
    }

    if (!Array.isArray(json.commands)) {
      errors.push(`${file}: commands must be an array`);
      continue;
    }

    json.commands.forEach((cmd, index) => {
      validateCommand(cmd, file, index, errors);
      if (!isCliCommandEntry(cmd, file)) return;
      const top = normalizeTopLevelName(cmd.name);
      if (topLevelNames.has(top)) {
        errors.push(
          `duplicate top-level command "${top}" in ${file} and ${topLevelNames.get(top)}`,
        );
      } else {
        topLevelNames.set(top, file);
      }
    });
  }

  if (errors.length) {
    for (const e of errors) fail(e);
    return;
  }

  process.stdout.write(`OK: validated ${topLevelNames.size} CLI commands in ${files.length} files.\n`);
}

main();
