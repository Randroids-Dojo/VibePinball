import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

const blockedDirs = new Set([
  ".git",
  ".next",
  "node_modules",
  "playwright-report",
  "test-results"
]);

const blockedCodes = new Set([0x2013, 0x2014]);
const hits = [];

const scan = async (dir) => {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (!blockedDirs.has(entry.name)) {
        await scan(join(dir, entry.name));
      }
      continue;
    }

    if (!entry.isFile()) {
      continue;
    }

    const path = join(dir, entry.name);
    const content = await readFile(path, "utf8").catch(() => null);
    if (content === null) {
      continue;
    }

    const lines = content.split("\n");
    lines.forEach((line, index) => {
      for (const char of line) {
        if (blockedCodes.has(char.codePointAt(0))) {
          hits.push(`${path}:${index + 1}:${line}`);
          break;
        }
      }
    });
  }
};

await scan(".");

if (hits.length > 0) {
  console.error(hits.join("\n"));
  process.exit(1);
}
