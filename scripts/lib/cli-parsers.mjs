export function parseCommandDescriptorObjects(tsText) {
  const out = [];
  const re = /\{\s*name:\s*"([^"]+)"\s*,\s*description:\s*"[^"]*"\s*,/g;
  for (;;) {
    const m = re.exec(tsText);
    if (!m) break;
    out.push(m[1]);
  }
  return out;
}

export function parseLooseBraceNames(tsText) {
  const out = [];
  const re = /\{\s*name:\s*"([^"]+)"\s*,/g;
  for (;;) {
    const m = re.exec(tsText);
    if (!m) break;
    out.push(m[1]);
  }
  return out;
}

export function parseCommandNamesArrays(tsText) {
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

export function mergeOfficialNames(...chunks) {
  const official = new Set();
  for (const text of chunks) {
    if (!text) continue;
    for (const n of parseCommandDescriptorObjects(text)) official.add(n);
    for (const n of parseLooseBraceNames(text)) official.add(n);
    for (const n of parseCommandNamesArrays(text)) official.add(n);
  }
  return official;
}

export function extractOptionFlags(tsText) {
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

export function buildCommandVarGraph(tsText) {
  const varToName = new Map();
  const varToParent = new Map();
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

export function resolveVarCommandPath(varName, graph) {
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

export function extractCommandPaths(tsText) {
  const graph = buildCommandVarGraph(tsText);
  const out = new Set();
  const rootRe = /\bprogram\s*[\r\n\s]*\.\s*command\(\s*"([^"]+)"\s*\)/g;
  for (;;) {
    const m = rootRe.exec(tsText);
    if (!m) break;
    out.add(m[1]);
  }
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
