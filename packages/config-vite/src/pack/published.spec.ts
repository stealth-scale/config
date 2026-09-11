import { type UserConfig } from "vite-plus";
import { expect, test } from "vite-plus/test";

import { published } from "#pack/published.ts";
import { answered, told } from "#vite.fixtures.ts";

/**
 * Reads back the entry map a layer states, given the export map a manifest declares.
 *
 * @param exports - The export map.
 * @returns The entry map.
 */
function entry(exports: Readonly<Record<string, unknown>>): Record<string, string> {
  const held = answered(published(), { manifest: { exports, name: "held" } }) as UserConfig;

  return (held.pack as { entry: Record<string, string> }).entry;
}

/**
 * Resolves the layer against a manifest, for the cases that refuse one.
 *
 * @param manifest - Whatever the manifest holds.
 * @returns What the layer does when it is resolved.
 */
function resolving(manifest: Parameters<typeof told>[0]): () => unknown {
  const held = published().config;

  return () => (typeof held === "function" ? held(told(manifest)) : held);
}

test("builds every subpath resolving through the source condition", () => {
  const held = entry({
    ".": { default: "./dist/index.mjs", "stealth-source": "./src/index.ts" },
    "./preset/web": { default: "./dist/preset/web.mjs", "stealth-source": "./src/preset/web.ts" },
  });

  expect(held).toEqual({ index: "src/index.ts", "preset/web": "src/preset/web.ts" });
});

test("keys each entry by the subpath a consumer imports, not by where its source sits", () => {
  expect(entry({ "./web": { "stealth-source": "./src/preset/browser.ts" } })).toEqual({
    web: "src/preset/browser.ts",
  });
});

test("takes a path a manifest spells without the marker every other one carries", () => {
  expect(entry({ ".": { "stealth-source": "src/index.ts" } })).toEqual({ index: "src/index.ts" });
});

test("passes over a subpath pointing straight at a shipped file, which pack.carry keeps", () => {
  const held = entry({ ".": { "stealth-source": "./src/index.ts" }, "./globals": "./g.d.ts" });

  expect(held).toEqual({ index: "src/index.ts" });
});

test("passes over a subpath that resolves to nothing at all", () => {
  const held = entry({ ".": { "stealth-source": "./src/index.ts" }, "./nothing": null });

  expect(held).toEqual({ index: "src/index.ts" });
});

test("is named the same whatever it found, so a repository can take the layer back", () => {
  expect(published().name).toBe("pack.published");
});

test("refuses a manifest declaring no exports, rather than publishing what the packer guesses", () => {
  expect(resolving({ manifest: { name: "held" } })).toThrow(/found no exports/u);
});

test("refuses an export map holding nothing it could build", () => {
  expect(resolving({ manifest: { exports: { "./thing": "./thing.json" } } })).toThrow(
    /found nothing to build/u,
  );
});

test("refuses a workspace root, which publishes nothing of its own", () => {
  const held = resolving({ at: "/repository", manifest: { exports: {} }, root: "/repository" });

  expect(held).toThrow(/publishes nothing/u);
});
