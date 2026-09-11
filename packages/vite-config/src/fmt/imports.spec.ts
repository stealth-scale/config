import { type UserConfig } from "vite-plus";
import { expect, test } from "vite-plus/test";

import { imports } from "#fmt/imports.ts";
import { SORT } from "#lint/rules/sort.ts";

/**
 * Reads the import settings the preset sets.
 *
 * @returns Those settings.
 */
function settings(): Record<string, unknown> {
  const held = (imports().config as UserConfig).fmt?.sortImports;

  return held as Record<string, unknown>;
}

test("names no framework, which belongs to the package that configures one", () => {
  expect(JSON.stringify(settings())).not.toContain("react");
  expect(settings()["customGroups"]).toEqual([]);
});

test("meets a side effect first, because its position is its meaning", () => {
  expect((settings()["groups"] as unknown[])[0]).toBe("side_effect");
});

test("meets what was installed next, then what is nearer the file", () => {
  expect(settings()["groups"]).toEqual([
    "side_effect",
    ["builtin", "external"],
    "internal",
    "subpath",
    ["parent", "sibling", "index"],
    "style",
    "unknown",
  ]);
});

test("names a group for what matches nothing, so no import lands wherever it happened to be", () => {
  expect(settings()["groups"]).toContain("unknown");
});

test("counts this repository's own scope as internal rather than as a stranger's", () => {
  expect(settings()["internalPattern"]).toEqual(["@stealthscale/"]);
});

test("states that scope as a prefix, which is what the formatter matches on", () => {
  for (const held of settings()["internalPattern"] as string[]) {
    expect(held.startsWith("^"), `${held} is a pattern, and would match nothing`).toBe(false);
  }
});

test("puts a blank line between groups, so the grouping is visible", () => {
  expect(settings()["newlinesBetween"]).toBe(true);
});

test("is the only sorter, because a second one here would have to agree with it forever", () => {
  expect(Object.keys(SORT)).not.toContain("perfectionist/sort-imports");
});
