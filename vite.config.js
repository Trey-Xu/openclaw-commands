import fs from "node:fs";
import path from "node:path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { ROOT } from "./scripts/lib/version.mjs";

function injectSwCacheVersion() {
  return {
    name: "inject-sw-cache-version",
    closeBundle() {
      const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, "package.json"), "utf8"));
      const cacheId = `openclaw-commands-${pkg.version.replace(/[^a-zA-Z0-9.-]/g, "-")}`;
      const swSrc = fs.readFileSync(path.join(ROOT, "public/sw.js"), "utf8");
      const swOut = swSrc.replace(/const CACHE = '[^']+'/, `const CACHE = '${cacheId}'`);
      fs.writeFileSync(path.join(ROOT, "dist/sw.js"), swOut);
    },
  };
}

export default defineConfig({
  plugins: [vue(), injectSwCacheVersion()],
  base: "/openclaw-commands/",
});
