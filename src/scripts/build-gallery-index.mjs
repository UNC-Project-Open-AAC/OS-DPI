#!/usr/bin/env node
// Build public/gallery/index.json from each public/gallery/<slug>/ folder
// (board.osdpi + meta.json). The manifest is generated, not committed; this runs
// via npm `prestart`, `prebuild`, and `npm run gallery:index`.
import { readdir, readFile, writeFile, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../public/gallery",
);

async function isDir(p) {
  try {
    return (await stat(p)).isDirectory();
  } catch {
    return false;
  }
}

async function build() {
  const examples = [];
  for (const slug of (await readdir(dir)).sort()) {
    const folder = path.join(dir, slug);
    if (!(await isDir(folder))) continue;
    if (slug.startsWith(".")) continue;
    // Report skips: an entry missing a file would otherwise vanish silently.
    if (!existsSync(path.join(folder, "meta.json"))) {
      console.warn(`[gallery:index] skipping ${slug}: no meta.json`);
      continue;
    }
    const m = JSON.parse(
      await readFile(path.join(folder, "meta.json"), "utf8"),
    );
    // An entry either ships its own board.osdpi or points `board` at a path the
    // site already serves, so shared boards are not committed twice.
    const bundled = existsSync(path.join(folder, "board.osdpi"));
    if (!bundled && !m.board) {
      console.warn(
        `[gallery:index] skipping ${slug}: no board.osdpi, and meta.json sets no "board"`,
      );
      continue;
    }
    examples.push({
      slug,
      title: m.title || slug,
      description: m.description || "",
      tags: Array.isArray(m.tags) ? m.tags : [],
      author: m.author || "",
      official: m.official === true,
      ...(bundled ? {} : { board: m.board }),
    });
  }
  await writeFile(
    path.join(dir, "index.json"),
    JSON.stringify(examples, null, 2) + "\n",
  );
  console.log(`[gallery:index] wrote ${examples.length} example(s)`);
}

build().catch((e) => {
  console.error("[gallery:index] failed:", e);
  process.exit(1);
});
