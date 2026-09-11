import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { type UserConfig } from "vite-plus";
import { expect, test } from "vite-plus/test";

import { projects } from "#test/projects.ts";

/**
 * Writes a workspace: a root manifest, and a directory for each package named under it.
 *
 * @param stated - What the root manifest says.
 * @param held - The package directories to create, each given a manifest of its own. A directory
 *   named with a trailing slash is created empty, which is what a skeleton left for a package
 *   nobody has written yet looks like.
 * @returns Where the workspace sits.
 */
function workspace(stated: Record<string, unknown>, held: readonly string[] = []): string {
  const at = mkdtempSync(join(tmpdir(), "stealth-projects-"));

  writeFileSync(join(at, "package.json"), JSON.stringify(stated));

  for (const one of held) {
    const where = join(at, one);

    mkdirSync(where, { recursive: true });

    if (!one.endsWith("/"))
      writeFileSync(join(where, "package.json"), JSON.stringify({ name: one }));
  }

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
  const at = workspace({ workspaces: ["apps/*", "libs/*"] }, ["apps/one", "libs/two"]);

  expect(block(at).projects).toEqual(["apps/one", "libs/two"]);
});

test("names the package's directory, so one with no config of its own is still a project", () => {
  const at = workspace({ workspaces: ["apps/*"] }, ["apps/bare"]);

  expect(block(at).projects).toEqual(["apps/bare"]);
});

test("passes over a skeleton directory, which holds no manifest and so is no package yet", () => {
  const at = workspace({ workspaces: ["apps/*"] }, ["apps/real", "apps/planned/"]);

  expect(block(at).projects).toEqual(["apps/real"]);
});

test("answers them in one order however the file system lists them", () => {
  const at = workspace({ workspaces: ["apps/*"] }, ["apps/zeta", "apps/alpha"]);

  expect(block(at).projects).toEqual(["apps/alpha", "apps/zeta"]);
});

test("reads the nested spelling a manifest may use instead", () => {
  const at = workspace({ workspaces: { packages: ["apps/*"] } }, ["apps/one"]);

  expect(block(at).projects).toEqual(["apps/one"]);
});

test("stops the root looking for its own tests, which all belong to a package", () => {
  const at = workspace({ workspaces: ["apps/*"] }, ["apps/one"]);

  expect(block(at).include).toEqual([]);
});

test("refuses a package, which knows nothing about what the workspace holds", () => {
  expect(() => projects(workspace({ name: "@acme/thing" }))).toThrow(/found no workspaces/u);
});

test("refuses a manifest that parses but holds no members at all", () => {
  const at = mkdtempSync(join(tmpdir(), "stealth-projects-"));

  writeFileSync(join(at, "package.json"), JSON.stringify("not an object"));

  expect(() => projects(at)).toThrow(/found no workspaces/u);
});

test("refuses a workspace naming somewhere nothing lives, rather than testing nothing", () => {
  expect(() => projects(workspace({ workspaces: ["apps/*"] }))).toThrow(/found no packages/u);
});
