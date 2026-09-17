/**
 * Checks the band order imports are sorted into, and what counts as internal.
 */

import { type UserConfig } from "vite";
import { describe, expect, it } from "vitest";

import { imports } from "#fmt/imports.ts";
import { SORT } from "#lint/rules/sort.ts";

/**
 * Unwraps the import-sorting block out of the layer.
 */
function settings(): Record<string, unknown> {
  const held = (imports().config as UserConfig).fmt?.sortImports;

  return held as Record<string, unknown>;
}

describe("imports", () => {
  it("names no framework", () => {
    expect(JSON.stringify(settings())).not.toContain("react");
    expect(settings()["customGroups"]).toStrictEqual([]);
  });

  it("sorts a side effect import first", () => {
    expect((settings()["groups"] as unknown[])[0]).toBe("side_effect");
  });

  it("sorts installed packages before modules nearer the file", () => {
    expect(settings()["groups"]).toStrictEqual([
      "side_effect",
      ["builtin", "external"],
      "internal",
      "subpath",
      ["parent", "sibling", "index"],
      "style",
      "unknown",
    ]);
  });

  it("names a group for what matches no other", () => {
    expect(settings()["groups"]).toContain("unknown");
  });

  it("counts this repository's own scope as internal", () => {
    expect(settings()["internalPattern"]).toStrictEqual(["@stealthscale/"]);
  });

  it("declares that scope as a prefix", () => {
    for (const held of settings()["internalPattern"] as string[]) {
      expect(held.startsWith("^"), `${held} is a pattern, and would match nothing`).toBe(false);
    }
  });

  it("puts a blank line between groups", () => {
    expect(settings()["newlinesBetween"]).toBe(true);
  });

  it("is the only import sorter configured", () => {
    expect(Object.keys(SORT)).not.toContain("perfectionist/sort-imports");
  });
});
