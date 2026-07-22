import { spawnSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";

const target = "src/types/worker-configuration.d.ts";
const check = process.argv.includes("--check");
const previous = check ? readFileSync(target, "utf8") : null;

const result = spawnSync(
  process.execPath,
  ["node_modules/wrangler/bin/wrangler.js", "types", target],
  { stdio: "inherit" },
);

if (result.status !== 0) process.exit(result.status ?? 1);

const generated = readFileSync(target, "utf8");
const normalized = generated
  .replace(
    /\tinterface GlobalProps \{\n\t\tmainModule: typeof import\("[^"]+"\);\n\t\}\n/,
    "",
  )
  .replace(/[ \t]+$/gm, "");

if (normalized === generated) {
  throw new Error("Wrangler GlobalProps declaration was not found");
}

writeFileSync(target, normalized);

if (check && previous !== normalized) {
  console.error(
    "Worker binding types are out of date. Run pnpm types:bindings.",
  );
  process.exit(1);
}
