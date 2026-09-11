import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { type UserConfig } from "vite-plus";
import { expect, test } from "vite-plus/test";

import { published } from "#pack/published.ts";

/**
 * Writes a manifest of exactly the given shape, and answers the directory it went in.
 *
 * @param held - Whatever the manifest holds, written as it stands.
 * @returns The directory.
 */
function written(held: unknown): string {
  const at = mkdtempSync(join(tmpdir(), "published-"));

  writeFileSync(join(at, "package.json"), JSON.stringify(held));

  return at;
}

/**
 * Writes a manifest declaring the given export map.
 *
 * @param exports - The export map.
 * @returns The directory holding it.
 */
function manifest(exports: unknown): string {
  return written({ exports, name: "held" });
}

/**
 * Reads back the entry map a layer states.
 *
 * @param at - The directory holding the manifest.
 * @returns The entry map.
 */
function entry(at: string): Record<string, string> {
  return ((published(at).config as UserConfig).pack as { entry: Record<string, string> }).entry;
}

test("builds every subpath resolving through the source condition", () => {
  const at = manifest({
    ".": { default: "./dist/index.mjs", "stealth-source": "./src/index.ts" },
    "./preset/web": { default: "./dist/preset/web.mjs", "stealth-source": "./src/preset/web.ts" },
  });

  expect(entry(at)).toEqual({ index: "src/index.ts", "preset/web": "src/preset/web.ts" });
});

test("keys each entry by the subpath a consumer imports, not by where its source sits", () => {
  const at = manifest({ "./web": { "stealth-source": "./src/preset/browser.ts" } });

  expect(entry(at)).toEqual({ web: "src/preset/browser.ts" });
});

test("takes a path a manifest spells without the marker every other one carries", () => {
  expect(entry(manifest({ ".": { "stealth-source": "src/index.ts" } }))).toEqual({
    index: "src/index.ts",
  });
});

test("passes over a subpath pointing straight at a shipped file, which pack.carry keeps", () => {
  const at = manifest({ ".": { "stealth-source": "./src/index.ts" }, "./globals": "./g.d.ts" });

  expect(entry(at)).toEqual({ index: "src/index.ts" });
});

test("passes over a subpath that resolves to nothing at all", () => {
  const at = manifest({ ".": { "stealth-source": "./src/index.ts" }, "./nothing": null });

  expect(entry(at)).toEqual({ index: "src/index.ts" });
});

test("names what it found, so provenance says where the entry list came from", () => {
  expect(published(manifest({ ".": { "stealth-source": "./src/index.ts" } })).name).toBe(
    "pack.published(index)",
  );
});

test("refuses a manifest declaring no exports, rather than publishing what the packer guesses", () => {
  expect(() => published(written({ name: "held" }))).toThrow(/found no exports/u);
});

test("refuses a manifest that is not an object", () => {
  expect(() => published(written("a package, allegedly"))).toThrow(/found no exports/u);
});

test("refuses exports that are not a map", () => {
  expect(() => published(manifest("./src/index.ts"))).toThrow(/found no exports/u);
});

test("refuses an export map holding nothing it could build", () => {
  expect(() => published(manifest({ "./thing": "./thing.json" }))).toThrow(
    /found nothing to build/u,
  );
});
