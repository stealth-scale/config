import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { type UserConfig } from "vite-plus";
import { expect, test } from "vite-plus/test";

import { projects } from "#test/override.ts";

/**
 * Writes a manifest into a directory of its own.
 *
 * @param stated - What the manifest says.
 * @returns Where that directory sits.
 */
function rooted(stated: Record<string, unknown>): string {
  const at = mkdtempSync(join(tmpdir(), "stealth-projects-"));

  writeFileSync(join(at, "package.json"), JSON.stringify(stated));

  return at;
}

/**
 * Reads the test block the preset sets.
 *
 * @param at - The directory holding the manifest.
 * @returns That block.
 */
function block(at: string): NonNullable<UserConfig["test"]> {
  return (projects(at).config as UserConfig).test as NonNullable<UserConfig["test"]>;
}

test("takes the packages from the manifest rather than from a second list", () => {
  const at = rooted({ workspaces: ["apps/*", "libs/*"] });

  expect(block(at).projects).toEqual(["apps/*/vite.config.ts", "libs/*/vite.config.ts"]);
});

test("names a config file, so a directory without one is not a project with no name", () => {
  const at = rooted({ workspaces: ["apps/*"] });

  for (const glob of block(at).projects as string[]) {
    expect(glob.endsWith("/vite.config.ts")).toBe(true);
  }
});

test("reads the nested spelling a manifest may use instead", () => {
  const at = rooted({ workspaces: { packages: ["apps/*"] } });

  expect(block(at).projects).toEqual(["apps/*/vite.config.ts"]);
});

test("stops the root looking for its own tests, which all belong to a package", () => {
  const at = rooted({ workspaces: ["apps/*"] });

  expect(block(at).include).toEqual([]);
});

test("refuses a package, which knows nothing about what the workspace holds", () => {
  const at = rooted({ name: "@acme/thing" });

  expect(() => projects(at)).toThrow(/found no workspaces/u);
});

test("refuses a manifest that parses but holds no members at all", () => {
  const at = mkdtempSync(join(tmpdir(), "stealth-projects-"));

  writeFileSync(join(at, "package.json"), JSON.stringify("not an object"));

  expect(() => projects(at)).toThrow(/found no workspaces/u);
});
