import { type UserConfig } from "vite-plus";
import { describe, expect, it } from "vitest";

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

describe("published", () => {
  it("builds every subpath resolving through the source condition", () => {
    const held = entry({
      ".": { default: "./dist/index.mjs", "stealth-source": "./src/index.ts" },
      "./preset/web": { default: "./dist/preset/web.mjs", "stealth-source": "./src/preset/web.ts" },
    });

    expect(held).toStrictEqual({ index: "src/index.ts", "preset/web": "src/preset/web.ts" });
  });

  it("keys each entry by the subpath a consumer imports", () => {
    expect(entry({ "./web": { "stealth-source": "./src/preset/browser.ts" } })).toStrictEqual({
      web: "src/preset/browser.ts",
    });
  });

  it("takes a path a manifest spells without the leading marker", () => {
    expect(entry({ ".": { "stealth-source": "src/index.ts" } })).toStrictEqual({
      index: "src/index.ts",
    });
  });

  it("ignores a subpath pointing straight at a shipped file", () => {
    const held = entry({ ".": { "stealth-source": "./src/index.ts" }, "./globals": "./g.d.ts" });

    expect(held).toStrictEqual({ index: "src/index.ts" });
  });

  it("ignores a subpath that resolves to nothing", () => {
    const held = entry({ ".": { "stealth-source": "./src/index.ts" }, "./nothing": null });

    expect(held).toStrictEqual({ index: "src/index.ts" });
  });

  it("keeps the same name whatever it found", () => {
    expect(published().name).toBe("pack.published");
  });

  it("throws for a manifest declaring no exports", () => {
    expect(resolving({ manifest: { name: "held" } })).toThrow(/found no exports/u);
  });

  it("throws for an export map with nothing it could build", () => {
    expect(resolving({ manifest: { exports: { "./thing": "./thing.json" } } })).toThrow(
      /found nothing to build/u,
    );
  });

  it("contributes nothing for a workspace root", () => {
    const held = resolving({ at: "/repository", manifest: {}, root: "/repository" });

    expect(held()).toStrictEqual({});
  });

  it("contributes nothing for a root even when a package below uses the root config", () => {
    const held = resolving({ at: "/repository", manifest: { exports: {} }, root: "/repository" });

    expect(held()).toStrictEqual({});
  });
});
